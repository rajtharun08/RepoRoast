import pytest
from app.services.github_service import GitHubService

def test_parse_repo_url():
    owner, repo = GitHubService.parse_repo_url("https://github.com/fastapi/fastapi")
    assert owner == "fastapi"
    assert repo == "fastapi"

    owner, repo = GitHubService.parse_repo_url("octocat/Hello-World.git")
    assert owner == "octocat"
    assert repo == "Hello-World"

    with pytest.raises(ValueError):
        GitHubService.parse_repo_url("invalid_url_with_no_slash")

def test_filter_file_tree_by_level():
    mock_tree = [
        {"path": "README.md", "type": "blob"},
        {"path": "package.json", "type": "blob"},
        {"path": "routes/auth.js", "type": "blob"},
        {"path": "src/utils/math.js", "type": "blob"},
        {"path": "node_modules/express/index.js", "type": "blob"},
        {"path": "image.png", "type": "blob"},
    ]

    # Level 1-3 (Screening) -> Only README and package.json
    l1_paths = GitHubService.filter_file_tree_by_level(mock_tree, level=2)
    assert "README.md" in l1_paths
    assert "package.json" in l1_paths
    assert "routes/auth.js" not in l1_paths
    assert "node_modules/express/index.js" not in l1_paths
    assert "image.png" not in l1_paths

    # Level 4-7 (System Design) -> Includes routes/auth.js
    l5_paths = GitHubService.filter_file_tree_by_level(mock_tree, level=5)
    assert "README.md" in l5_paths
    assert "package.json" in l5_paths
    assert "routes/auth.js" in l5_paths
    assert "src/utils/math.js" not in l5_paths

    # Level 8-10 (Deep Code Review) -> Includes source code files
    l9_paths = GitHubService.filter_file_tree_by_level(mock_tree, level=9)
    assert "README.md" in l9_paths
    assert "package.json" in l9_paths
    assert "routes/auth.js" in l9_paths
    assert "src/utils/math.js" in l9_paths
    assert "node_modules/express/index.js" not in l9_paths
    assert "image.png" not in l9_paths
