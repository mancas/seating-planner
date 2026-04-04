#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh [patch|minor|major]
# Defaults to "patch" if no argument is provided.

BUMP_TYPE="${1:-patch}"

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  echo "Error: bump type must be 'patch', 'minor', or 'major'"
  exit 1
fi

# Ensure we're on main and up to date
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: must be on 'main' branch (currently on '$CURRENT_BRANCH')"
  exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean. Commit or stash changes first."
  exit 1
fi

# Ensure gh CLI is available
if ! command -v gh &>/dev/null; then
  echo "Error: 'gh' CLI is not installed. Install it from https://cli.github.com/"
  exit 1
fi

# Read current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case "$BUMP_TYPE" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
TAG="v${NEW_VERSION}"

echo "Bumping version: ${CURRENT_VERSION} -> ${NEW_VERSION} (${BUMP_TYPE})"

# Update package.json version (without npm publish side effects)
npm version "$NEW_VERSION" --no-git-tag-version

# Commit and tag
git add package.json package-lock.json 2>/dev/null || git add package.json
git commit -m "chore: release ${TAG}"
git tag -a "$TAG" -m "Release ${TAG}"

# Push commit and tag
git push origin main
git push origin "$TAG"

# Create GitHub release with auto-generated notes
gh release create "$TAG" --generate-notes --title "$TAG"

echo ""
echo "Released ${TAG} successfully!"
echo "View at: $(gh release view "$TAG" --json url -q '.url')"
