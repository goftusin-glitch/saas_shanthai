from fastapi import APIRouter, HTTPException, BackgroundTasks
from pathlib import Path
from typing import Optional
import os
import json
import aiohttp
import asyncio
from datetime import datetime

router = APIRouter(prefix="/templates", tags=["templates"])

# GitHub repository configuration
GITHUB_OWNER = "manojkanur"
GITHUB_REPO = "MicroSaaS-Template-Private"
GITHUB_BRANCH = "main"
GITHUB_API = "https://api.github.com"
GITHUB_RAW = "https://raw.githubusercontent.com"

# Cache directory
CACHE_DIR = Path(__file__).resolve().parent.parent / "template_cache"
CACHE_DIR.mkdir(exist_ok=True)

# Metadata file for tracking sync status
METADATA_FILE = CACHE_DIR / "_metadata.json"

# Allowed file extensions for viewing
ALLOWED_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss',
    '.json', '.yml', '.yaml', '.md', '.txt', '.sh', '.bat', '.sql',
    '.toml', '.cfg', '.ini', '.env', '.gitignore'
}

# Directories to exclude when fetching
EXCLUDED_DIRS = {'node_modules', '.git', '__pycache__', '.venv', 'venv', 'dist', 'build'}

def get_metadata():
    """Get cache metadata"""
    if METADATA_FILE.exists():
        with open(METADATA_FILE, 'r') as f:
            return json.load(f)
    return {"last_sync": None, "status": "not_synced", "file_count": 0}

def save_metadata(data):
    """Save cache metadata"""
    with open(METADATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

async def fetch_github_contents(session, path: str = "") -> list:
    """Fetch contents of a directory from GitHub"""
    url = f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}"
    params = {"ref": GITHUB_BRANCH}
    
    async with session.get(url, params=params) as response:
        if response.status == 200:
            return await response.json()
        elif response.status == 403:
            # Rate limited
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Try again later.")
        else:
            raise HTTPException(status_code=response.status, detail=f"Failed to fetch from GitHub: {await response.text()}")

async def fetch_file_content(session, download_url: str) -> str:
    """Fetch content of a single file"""
    async with session.get(download_url) as response:
        if response.status == 200:
            return await response.text()
        return ""

async def sync_directory(session, path: str = "", depth: int = 0):
    """Recursively sync a directory from GitHub to local cache"""
    if depth > 10:  # Prevent infinite recursion
        return
    
    try:
        contents = await fetch_github_contents(session, path)
        
        for item in contents:
            name = item["name"]
            item_path = item["path"]
            item_type = item["type"]
            
            # Skip excluded directories and hidden files (except specific ones)
            if item_type == "dir" and name in EXCLUDED_DIRS:
                continue
            if name.startswith('.') and name not in ['.env.example', '.gitignore', '.claude']:
                continue
            
            local_path = CACHE_DIR / item_path
            
            if item_type == "dir":
                local_path.mkdir(parents=True, exist_ok=True)
                # Recursively sync subdirectory
                await sync_directory(session, item_path, depth + 1)
            else:
                # It's a file - check if we should download it
                extension = Path(name).suffix.lower()
                if extension in ALLOWED_EXTENSIONS or name in ['.gitignore', '.env.example']:
                    local_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    if item.get("download_url"):
                        content = await fetch_file_content(session, item["download_url"])
                        with open(local_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                            
    except Exception as e:
        print(f"Error syncing {path}: {e}")

async def perform_sync():
    """Perform full sync from GitHub to local cache"""
    # Clear existing cache (except metadata)
    for item in CACHE_DIR.iterdir():
        if item.name != "_metadata.json":
            if item.is_dir():
                import shutil
                shutil.rmtree(item)
            else:
                item.unlink()
    
    async with aiohttp.ClientSession() as session:
        await sync_directory(session)
    
    # Count files
    file_count = sum(1 for _ in CACHE_DIR.rglob("*") if _.is_file() and _.name != "_metadata.json")
    
    # Update metadata
    save_metadata({
        "last_sync": datetime.now().isoformat(),
        "status": "synced",
        "file_count": file_count,
        "repo": f"{GITHUB_OWNER}/{GITHUB_REPO}",
        "branch": GITHUB_BRANCH
    })

def get_file_info(path: Path, base: Path) -> dict:
    """Get file/directory info"""
    relative_path = str(path.relative_to(base)).replace('\\', '/')
    is_dir = path.is_dir()
    
    info = {
        "name": path.name,
        "path": relative_path,
        "type": "dir" if is_dir else "file",
    }
    
    if not is_dir:
        info["size"] = path.stat().st_size
        info["extension"] = path.suffix.lower()
    
    return info

@router.get("/status")
async def get_sync_status():
    """Get the current sync status"""
    metadata = get_metadata()
    return {
        "status": metadata.get("status", "not_synced"),
        "last_sync": metadata.get("last_sync"),
        "file_count": metadata.get("file_count", 0),
        "repo": f"https://github.com/{GITHUB_OWNER}/{GITHUB_REPO}",
        "branch": GITHUB_BRANCH
    }

@router.post("/sync")
async def trigger_sync(background_tasks: BackgroundTasks):
    """Trigger a sync from GitHub (runs in background)"""
    save_metadata({
        "last_sync": get_metadata().get("last_sync"),
        "status": "syncing",
        "file_count": get_metadata().get("file_count", 0)
    })
    
    # Run sync in background
    background_tasks.add_task(asyncio.run, perform_sync())
    
    return {"message": "Sync started", "status": "syncing"}

@router.get("/files")
async def get_template_files(path: Optional[str] = ""):
    """Get list of files and directories at the given path"""
    metadata = get_metadata()
    
    # Auto-sync if not synced yet
    if metadata.get("status") != "synced":
        await perform_sync()
    
    try:
        target_path = CACHE_DIR / path if path else CACHE_DIR
        
        if not target_path.exists():
            raise HTTPException(status_code=404, detail="Path not found")
        
        if not target_path.is_dir():
            raise HTTPException(status_code=400, detail="Path is not a directory")
        
        items = []
        for item in sorted(target_path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower())):
            # Skip metadata file and hidden files
            if item.name.startswith('_') or (item.name.startswith('.') and item.name not in ['.env.example', '.gitignore', '.claude']):
                continue
            
            items.append(get_file_info(item, CACHE_DIR))
        
        return {
            "path": path,
            "items": items,
            "parent": str(Path(path).parent) if path else None,
            "last_sync": metadata.get("last_sync")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/content")
async def get_file_content(path: str):
    """Get content of a specific file"""
    try:
        target_path = CACHE_DIR / path
        
        if not target_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        if target_path.is_dir():
            raise HTTPException(status_code=400, detail="Path is a directory")
        
        # Check file size (limit to 1MB)
        if target_path.stat().st_size > 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large to display")
        
        try:
            with open(target_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Binary file cannot be displayed")
        
        return {
            "path": path,
            "name": target_path.name,
            "content": content,
            "extension": target_path.suffix.lower(),
            "size": len(content)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
