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
        api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(api_url, headers={"User-Agent": "RepoRoast-App"})
            if res.status_code == 404:
                # Try master branch if main branch isn't found
                api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
                res = await client.get(api_url, headers={"User-Agent": "RepoRoast-App"})
            
            if res.status_code != 200:
                return []
            
            data = res.json()
            return data.get("tree", [])

    @classmethod
    async def fetch_raw_file_content(cls, owner: str, repo: str, path: str) -> Optional[str]:
        """Fetch raw file content from GitHub."""
        for branch in ["main", "master"]:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(raw_url, headers={"User-Agent": "RepoRoast-App"})
                if res.status_code == 200:
                    return res.text
        return None

    @classmethod
    def filter_file_tree_by_level(cls, file_tree: List[Dict[str, Any]], level: int) -> List[str]:
        """Filter file tree paths based on interview difficulty escalation level."""
        paths = []
        for item in file_tree:
            path = item.get("path", "")
            # Skip ignored directories and binary extensions
            if any(part in IGNORED_PATHS for part in path.split("/")):
                continue
            if any(path.endswith(ext) for ext in IGNORED_EXTENSIONS):
                continue
            
            if level <= 3:
                # Screening level: README and dependency manifests
                if path.lower().startswith("readme") or path.split("/")[-1] in DEPENDENCY_FILES:
                    paths.append(path)
            elif level <= 7:
                # System design level: README, dependency files, directory structure, and routers/entrypoints
                is_readme = path.lower().startswith("readme")
                is_dep = path.split("/")[-1] in DEPENDENCY_FILES
                is_router = any(re.search(pat, path, re.IGNORECASE) for pat in ROUTING_PATTERNS)
                if is_readme or is_dep or is_router or item.get("type") == "tree":
                    paths.append(path)
            else:
                # Deep code review: Full source code files
                if item.get("type") == "blob":
                    paths.append(path)
        
        return paths

    @classmethod
    async def get_level_context(cls, repo_url: str, level: int) -> Dict[str, Any]:
        """Generate trimmed level context payload for Gemini prompt injection."""
        owner, repo = cls.parse_repo_url(repo_url)
        tree = await cls.fetch_repo_file_tree(owner, repo)
        filtered_paths = cls.filter_file_tree_by_level(tree, level)
        
        # Fetch file contents for high-priority files
        file_contents = {}
        readme_content = await cls.fetch_raw_file_content(owner, repo, "README.md")
        if not readme_content:
            readme_content = await cls.fetch_raw_file_content(owner, repo, "readme.md")
        if readme_content:
            file_contents["README.md"] = readme_content[:3000]  # Cap snippet length
            
        # Fetch key dependency manifest files
        for dep in DEPENDENCY_FILES:
            content = await cls.fetch_raw_file_content(owner, repo, dep)
            if content:
                file_contents[dep] = content[:2000]
                
        # For System Design / Deep Code Review, fetch routing/core files
        if level >= 4:
            router_count = 0
            for path in filtered_paths:
                if router_count >= 5: # Limit top key files to keep API responsive
                    break
                if any(re.search(pat, path, re.IGNORECASE) for pat in ROUTING_PATTERNS) and path not in file_contents:
                    content = await cls.fetch_raw_file_content(owner, repo, path)
                    if content:
                        file_contents[path] = content[:2500]
                        router_count += 1

        return {
            "owner": owner,
            "repo": repo,
            "level": level,
            "file_count": len(filtered_paths),
            "file_tree": filtered_paths[:100],  # Cap file tree list display
            "file_contents": file_contents
        }

    @classmethod
    async def fetch_user_repos(cls, username: str) -> List[Dict[str, Any]]:
        """Fetch public repositories for a GitHub user/org with 403 fallback handling."""
        api_url = f"https://api.github.com/users/{username.strip()}/repos?sort=updated&per_page=12"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RepoRoast-App/1.0",
            "Accept": "application/vnd.github.v3+json"
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(api_url, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    if isinstance(data, list) and len(data) > 0:
                        return data
        except Exception:
            pass

        # Fallback to curated public repositories if GitHub API rate-limits (403/429) or user is not found
        return [
            {
                "id": 101,
                "name": "fastapi",
                "html_url": "https://github.com/fastapi/fastapi",
                "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
                "stargazers_count": 68500,
                "language": "Python"
            },
            {
                "id": 102,
                "name": "react",
                "html_url": "https://github.com/facebook/react",
                "description": "The library for web and native user interfaces",
                "stargazers_count": 220000,
                "language": "JavaScript"
            },
            {
                "id": 103,
                "name": "express",
                "html_url": "https://github.com/expressjs/express",
                "description": "Fast, unopinionated, minimalist web framework for node",
                "stargazers_count": 63000,
                "language": "JavaScript"
            },
            {
                "id": 104,
                "name": "flask",
                "html_url": "https://github.com/pallets/flask",
                "description": "The Python micro framework for building web applications",
                "stargazers_count": 65000,
                "language": "Python"
            },
            {
                "id": 105,
                "name": "RepoRoast",
                "html_url": "https://github.com/rajtharun08/RepoRoast",
                "description": "Realistic technical interview escalation platform",
                "stargazers_count": 15,
                "language": "Python"
            }
        ]
