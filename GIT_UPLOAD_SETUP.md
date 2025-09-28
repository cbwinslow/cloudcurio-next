# Git Upload Configuration

This repository is configured to push to both GitHub and GitLab remotes simultaneously. This document explains how to use the configuration and troubleshoot common issues.

## SSH Keys

We've configured a dedicated SSH key for git operations with the correct email address:

Public Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPKH6Lp5BNaBsC4F+j/TiVBqHawPj1GGA+grkDlV13WH blaine.winslow@gmail.com`

This key has been added to both GitHub and GitLab accounts.

## SSH Configuration

The SSH configuration in `~/.ssh/config` includes specific configurations for both GitHub and GitLab:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_blaine
  PreferredAuthentications publickey

Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/id_ed25519_blaine
  PreferredAuthentications publickey
```

## Push Script

We've created a script `push-to-both.sh` that allows you to push to both remotes simultaneously:

```bash
./push-to-both.sh
```

This script will:
- Push the current branch to both GitHub and GitLab
- Push any tags to both GitHub and GitLab
- Provide feedback on the success/failure of each operation

## Git Configuration

Both global and local git configurations use the correct email address:
- Email: `blaine.winslow@gmail.com`
- Name: `cbwinslow`

## Troubleshooting

If you encounter issues:

1. Verify your SSH key is added to both GitHub and GitLab accounts
2. Check that your `~/.ssh/config` file has the correct host configurations
3. Ensure the SSH key is loaded in your SSH agent: `ssh-add -l`
4. Test SSH connection to each platform:
   - `ssh -T git@github.com`
   - `ssh -T git@gitlab.com`

## Remotes

Current git remotes:
- origin (GitHub): git@github.com:cbwinslow/cloudcurio-next
- gitlab: git@gitlab.com:cbwinslow/cloudcurio-next.git