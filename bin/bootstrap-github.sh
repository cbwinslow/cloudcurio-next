#!/usr/bin/env bash
set -euo pipefail
REPO="${1:-cloudcurio-next-blog}"
if ! command -v gh >/dev/null; then echo "Install GitHub CLI (gh)"; exit 1; fi
git init
git branch -M main
git add .
git commit -m "chore: init cloudcurio blog"
gh repo create "${GITHUB_USER:-cbwinslow}/${REPO}" --public --source=. --remote=origin --push
gh repo edit "${GITHUB_USER:-cbwinslow}/${REPO}" --description "Cloudcurio Next.js + Cloudflare AI blog"
echo "Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets in GitHub repo settings."
