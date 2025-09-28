#!/bin/bash

# Script to verify SSH connections to both GitHub and GitLab

echo "Testing SSH connections..."

echo "Testing GitHub..."
if ssh -T -o ConnectTimeout=5 git@github.com; then
    echo "✓ GitHub SSH connection successful"
else
    echo "✗ GitHub SSH connection failed"
fi

echo "Testing GitLab..."
if ssh -T -o ConnectTimeout=5 git@gitlab.com; then
    echo "✓ GitLab SSH connection successful"
else
    echo "✗ GitLab SSH connection failed"
    echo "Note: Make sure you have added the SSH key to your GitLab account:"
    echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPKH6Lp5BNaBsC4F+j/TiVBqHawPj1GGA+grkDlV13WH blaine.winslow@gmail.com"
fi

echo "Done!"