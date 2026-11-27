"""Acquire ONLY pinned source assets and verify Git blob hashes, no external code execution."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen, Request
ROOT = Path(__file__).resolve().parents[2]
MANIFEST = json.loads((Path(__file__).parent / "manifest.json").read_text())
DEST = ROOT / "dist" / "s02-r8-source"
BASE = "https://raw.githubusercontent.com/" + MANIFEST["source"] + "/" + MANIFEST["commit"] + "/"

def acquire(task):
    item, target = task
    with urlopen(Request(BASE + item["path"], headers={"User-Agent": "Kirjane-R8-asset-workshop"}), timeout=90) as response:
        data = response.read(item["bytes"] + 1)
    digest = hashlib.sha1(("blob %d\0" % len(data)).encode() + data).hexdigest()
    if len(data) != item["bytes"] or digest != item["sha"]:
        raise ValueError("source hash mismatch: " + item["path"])
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print("verified", item["sha"], item["path"], flush=True)

if __name__ == "__main__":
    tasks = [(MANIFEST["licenseFile"], DEST / "LICENSE.md")]
    for asset in MANIFEST["assets"]:
        for item in asset["files"]:
            tasks.append((item, DEST / asset["role"] / Path(item["path"]).name))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(acquire, tasks))
