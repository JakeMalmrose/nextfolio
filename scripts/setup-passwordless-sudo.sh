#!/bin/bash
# This script sets up passwordless sudo for Docker commands
# Run this script manually on your server before using GitHub Actions

# Get the current username
USER=$(whoami)

# Create the sudoers file for Docker commands
echo "Setting up passwordless sudo for Docker commands..."
echo "${USER} ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/bin/docker compose, /usr/local/bin/docker, /usr/local/bin/docker-compose, /usr/local/bin/docker compose" | sudo tee /etc/sudoers.d/docker-passwordless
sudo chmod 440 /etc/sudoers.d/docker-passwordless

echo "✅ Setup complete. The user ${USER} can now use sudo with Docker commands without a password prompt."
echo "Try running: sudo docker ps"
