import re
import httpx
from typing import Dict, Any, List, Optional

IGNORED_PATHS = {
    "node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build",
    ".idea", ".vscode", ".next", ".nuxt", "coverage", "vendor"
}

IGNORED_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pdf", ".zip", ".tar",
    ".gz", ".exe", ".dll", ".so", ".dylib", ".woff", ".woff2", ".ttf", ".eot",
    ".mp3", ".mp4", ".wav", ".lock"
}

DEPENDENCY_FILES = {
    "package.json", "requirements.txt", "pyproject.toml", "Pipfile",
    "go.mod", "Cargo.toml", "build.gradle", "pom.xml"
}

ROUTING_PATTERNS = [
    r"routes?\/", r"api\/", r"controllers?\/", r"views?\/", r"endpoints?\/",
    r"main\.py$", r"app\.py$", r"server\.js$", r"server\.ts$", r"index\.js$",
    r"index\.ts$", r"App\.jsx$", r"App\.tsx$", r"router"
]

class GitHubService:
    @staticmethod
    def parse_repo_url(url: str) -> tuple[str, str]:
        """Extract owner and repo name from GitHub URL or string 'owner/repo'."""
        cleaned = url.strip().rstrip("/")
        match = re.search(r"github\.com/([^/]+)/([^/]+)", cleaned)
        if match:
            return match.group(1), match.group(2).replace(".git", "")
        parts = cleaned.split("/")
        if len(parts) == 2:
            return parts[0], parts[1].replace(".git", "")
        raise ValueError(f"Invalid GitHub repository URL or format: '{url}'")

    @classmethod
    async def fetch_repo_file_tree(cls, owner: str, repo: str) -> List[Dict[str, Any]]:
        """Fetch git tree via GitHub API."""
        for branch in ["main", "master"]:
            api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(api_url, headers={"User-Agent": "RepoRoast-App"})
                    if res.status_code == 200:
                        data = res.json()
                        tree = data.get("tree", [])
                        if tree:
                            return tree
            except Exception as e:
                print(f"Git tree fetch warning for {owner}/{repo}: {e}")
        return []

    @classmethod
    async def fetch_raw_file_content(cls, owner: str, repo: str, path: str) -> Optional[str]:
        """Fetch raw file content directly from raw.githubusercontent.com."""
        for branch in ["main", "master"]:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(raw_url, headers={"User-Agent": "RepoRoast-App"})
                    if res.status_code == 200:
                        return res.text
            except Exception:
                continue
        return None

    @classmethod
    def filter_file_tree_by_level(cls, file_tree: List[Dict[str, Any]], level: int) -> List[str]:
        """Filter file tree paths based on interview difficulty escalation level."""
        paths = []
        for item in file_tree:
            path = item.get("path", "")
            if any(part in IGNORED_PATHS for part in path.split("/")):
                continue
            if any(path.endswith(ext) for ext in IGNORED_EXTENSIONS):
                continue
            
            if level <= 3:
                if path.lower().startswith("readme") or path.split("/")[-1] in DEPENDENCY_FILES:
                    paths.append(path)
            elif level <= 7:
                is_readme = path.lower().startswith("readme")
                is_dep = path.split("/")[-1] in DEPENDENCY_FILES
                is_router = any(re.search(pat, path, re.IGNORECASE) for pat in ROUTING_PATTERNS)
                if is_readme or is_dep or is_router or item.get("type") == "tree":
                    paths.append(path)
            else:
                if item.get("type") == "blob":
                    paths.append(path)
        
        return paths

    @classmethod
    async def get_level_context(cls, repo_url: str, level: int) -> Dict[str, Any]:
        """Generate trimmed level context payload for Gemini prompt injection."""
        owner, repo = cls.parse_repo_url(repo_url)
        tree = await cls.fetch_repo_file_tree(owner, repo)
        filtered_paths = cls.filter_file_tree_by_level(tree, level)
        
        file_contents = {}
        
        # Fetch README
        readme_content = await cls.fetch_raw_file_content(owner, repo, "README.md")
        if not readme_content:
            readme_content = await cls.fetch_raw_file_content(owner, repo, "readme.md")
        if readme_content:
            file_contents["README.md"] = readme_content[:3000]
            if "README.md" not in filtered_paths:
                filtered_paths.append("README.md")

        # Fetch key dependency manifest files
        for dep in DEPENDENCY_FILES:
            content = await cls.fetch_raw_file_content(owner, repo, dep)
            if content:
                file_contents[dep] = content[:2000]
                if dep not in filtered_paths:
                    filtered_paths.append(dep)

        # For System Design / Deep Code Review, fetch core source files
        if level >= 4:
            router_count = 0
            for path in filtered_paths:
                if router_count >= 5:
                    break
                if any(re.search(pat, path, re.IGNORECASE) for pat in ROUTING_PATTERNS) and path not in file_contents:
                    content = await cls.fetch_raw_file_content(owner, repo, path)
                    if content:
                        file_contents[path] = content[:2500]
                        router_count += 1

        # If file_tree was empty due to GitHub API rate limit on git/trees, build synthetic tree from fetched files
        if not filtered_paths and file_contents:
            filtered_paths = list(file_contents.keys())

        # If completely empty, provide fallback README representation
        if not filtered_paths:
            filtered_paths = ["README.md"]
            file_contents["README.md"] = f"# {repo}\nRepository code structure for {owner}/{repo}."

        return {
            "owner": owner,
            "repo": repo,
            "level": level,
            "file_count": len(filtered_paths),
            "file_tree": filtered_paths[:100],
            "file_contents": file_contents
        }
