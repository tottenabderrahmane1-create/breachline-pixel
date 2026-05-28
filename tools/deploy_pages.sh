#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="/tmp/breachline-pixel-pages"

cleanup() {
  git -C "$ROOT" worktree remove "$WORKTREE" --force >/dev/null 2>&1 || true
}
trap cleanup EXIT

cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree has uncommitted changes. Commit or stash them before deploying." >&2
  exit 1
fi

rm -rf "$WORKTREE"
git fetch origin gh-pages >/dev/null 2>&1 || true
git worktree add "$WORKTREE" origin/gh-pages >/dev/null

rsync -a --delete \
  --exclude '.git' \
  --exclude '.github' \
  --exclude 'docs' \
  --exclude 'output' \
  --exclude '__pycache__' \
  --exclude '.DS_Store' \
  "$ROOT/docs/" "$WORKTREE/"

date -u '+%Y-%m-%dT%H:%M:%SZ' > "$WORKTREE/DEPLOY_VERSION.txt"

cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "No Pages changes to deploy."
else
  git commit -m "Deploy static game"
  git push origin HEAD:gh-pages
fi

cd "$ROOT"
git worktree remove "$WORKTREE" >/dev/null

gh api -X PUT repos/tottenabderrahmane1-create/breachline-pixel/pages \
  --input - >/dev/null <<'JSON'
{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}
JSON

gh api -X POST repos/tottenabderrahmane1-create/breachline-pixel/pages/builds \
  --jq '{status:.status,url:.url}'
