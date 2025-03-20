# NextFolio Scripts

This directory contains utility scripts for the NextFolio project.

## Setup Scripts

### setup-passwordless-sudo.sh

This script sets up passwordless sudo for Docker commands, which is required for GitHub Actions deployment to work correctly.

**Before running GitHub Actions CI/CD workflow, run this script once on your server:**

```bash
# SSH into your server
ssh yourusername@yourserver

# Navigate to the cloned repository
cd ~/nextfolio

# Make the script executable
chmod +x scripts/setup-passwordless-sudo.sh

# Run the script (you'll be prompted for your password once)
./scripts/setup-passwordless-sudo.sh
```

This configuration only needs to be done once. After that, the GitHub Actions will be able to use sudo for Docker commands without password prompts.
