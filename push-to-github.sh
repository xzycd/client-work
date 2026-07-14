#!/usr/bin/env bash
# Pushes this folder to a new GitHub repo.
# Usage:  bash push-to-github.sh [repo-name] [private|public]
# Example: bash push-to-github.sh client-work private
set -euo pipefail

REPO_NAME="${1:-client-work}"
VISIBILITY="${2:-private}"

cd "$(dirname "$0")"
echo "Repo folder: $(pwd)"

# Start from a clean git state (removes any stale .git created elsewhere).
rm -rf .git
git init -q -b main
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-audangas}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-audangas@yahoo.com}" \
    commit -q -m "Add MERIDIAN studio + AETHER retreats landing pages"
echo "Committed $(git rev-list --count HEAD) commit."

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "Creating GitHub repo '$REPO_NAME' ($VISIBILITY) and pushing..."
  gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push
  gh repo view --web || true
  echo "Done."
else
  cat <<EOF

GitHub CLI (gh) not found or not logged in. Finish manually:

  Option A - install the CLI, then re-run this script:
      brew install gh && gh auth login && bash push-to-github.sh "$REPO_NAME" "$VISIBILITY"

  Option B - create an EMPTY repo named "$REPO_NAME" at https://github.com/new
             (do NOT add a README), then run:
      git remote add origin https://github.com/<your-username>/$REPO_NAME.git
      git push -u origin main
EOF
fi
