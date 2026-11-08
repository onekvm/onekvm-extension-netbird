#!/usr/bin/env python3
"""Check and optionally update the pinned NetBird client release."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
RECIPE = ROOT / "oe-recipes/recipes-onekvm/netbird/onekvm-extension-netbird_1.0.0.bb"
UPSTREAM_REPO = "https://github.com/netbirdio/netbird.git"
UPSTREAM_API = "https://api.github.com/repos/netbirdio/netbird/releases/latest"
VERSION_KEY = "NETBIRD_VERSION"
TAG_PREFIX = "v"
VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")


def latest_version() -> str:
    override = os.environ.get("UPSTREAM_VERSION")
    if override:
        return override.removeprefix(TAG_PREFIX)
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "onekvm-netbird-version-check"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    with urlopen(Request(UPSTREAM_API, headers=headers), timeout=30) as response:
        tag = json.load(response).get("tag_name", "")
    version = tag.removeprefix(TAG_PREFIX)
    if not version:
        raise RuntimeError("GitHub did not return the latest NetBird tag")
    return version


def release_commit(version: str) -> str:
    override = os.environ.get("UPSTREAM_SRCREV")
    if override:
        return override
    tag = f"refs/tags/{TAG_PREFIX}{version}"
    result = subprocess.run(
        ["git", "ls-remote", UPSTREAM_REPO, tag, f"{tag}^{{}}"],
        check=True,
        capture_output=True,
        text=True,
    )
    refs = {line.split(maxsplit=1)[1]: line.split(maxsplit=1)[0] for line in result.stdout.splitlines()}
    return refs.get(f"{tag}^{{}}") or refs.get(tag) or _missing_tag(version)


def _missing_tag(version: str) -> str:
    raise RuntimeError(f"NetBird release tag {TAG_PREFIX}{version} was not found")


def current_state() -> tuple[str, str]:
    text = RECIPE.read_text()
    version = re.search(rf'(?m)^{VERSION_KEY}\s*=\s*"([^"]+)"\s*$', text)
    revision = re.search(r'(?m)^SRCREV_upstream\s*=\s*"([0-9a-f]{40})"\s*$', text)
    if not version or not revision:
        raise RuntimeError("could not parse the NetBird version fields")
    return version.group(1), revision.group(1)


def replace_once(text: str, pattern: str, replacement: str, description: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"could not update {description}")
    return updated


def set_github_output(name: str, value: str) -> None:
    output_path = os.environ.get("GITHUB_OUTPUT")
    if output_path:
        with open(output_path, "a", encoding="utf-8") as output:
            output.write(f"{name}={value}\n")


def update(version: str, commit: str) -> None:
    text = RECIPE.read_text()
    text = replace_once(
        text,
        rf'^({VERSION_KEY}\s*=\s*")[^"]+("\s*)$',
        rf"\g<1>{version}\g<2>",
        "NetBird version",
    )
    text = replace_once(
        text,
        r'^(SRCREV_upstream\s*=\s*")[0-9a-f]{40}("\s*)$',
        rf"\g<1>{commit}\g<2>",
        "NetBird source revision",
    )
    RECIPE.write_text(text)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--update", action="store_true", help="update the recipe before checking")
    args = parser.parse_args()

    latest = latest_version()
    if not VERSION_RE.fullmatch(latest):
        raise RuntimeError(f"unsupported NetBird version {latest!r}")
    commit = release_commit(latest)
    current, current_commit = current_state()
    if not VERSION_RE.fullmatch(current):
        raise RuntimeError(f"unsupported pinned NetBird version {current!r}")

    problems = []
    if current != latest:
        problems.append(f"version is {current}, expected {latest}")
    if current_commit != commit:
        problems.append(f"SRCREV_upstream is {current_commit}, expected {commit}")
    if problems and args.update:
        if tuple(map(int, current.split("."))) > tuple(map(int, latest.split("."))):
            raise RuntimeError(f"refusing to downgrade NetBird from {current} to {latest}")
        update(latest, commit)
        current, current_commit = current_state()
        problems = [] if current == latest and current_commit == commit else ["updated fields did not verify"]

    print(f"NetBird release: {latest} ({commit})")
    print(f"Pinned client: {current} ({current_commit})")
    set_github_output("version", latest)
    if problems:
        for problem in problems:
            print(f"ERROR: {problem}", file=sys.stderr)
        return 1
    print("NetBird and its pinned source revision are in sync.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
