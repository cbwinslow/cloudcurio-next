#!/bin/bash

# Script to push current branch to both GitHub and GitLab remotes

echo "Starting push to both GitHub and GitLab remotes..."

# Get current branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

# Push to GitHub
echo "Pushing to GitHub..."
if git push origin "$current_branch"; then
    echo "✓ Successfully pushed to GitHub"
else
    echo "✗ Failed to push to GitHub"
fi

# Push to GitLab
echo "Pushing to GitLab..."
if git push gitlab "$current_branch"; then
    echo "✓ Successfully pushed to GitLab"
else
    echo "✗ Failed to push to GitLab"
fi

# Push tags to both remotes (if any)
echo "Pushing tags to both remotes..."
if git push origin --tags; then
    echo "✓ Successfully pushed tags to GitHub"
else
    echo "✗ Failed to push tags to GitHub"
fi

if git push gitlab --tags; then
    echo "✓ Successfully pushed tags to GitLab"
else
    echo "✗ Failed to push tags to GitLab"
fi

echo "Push operations completed!"