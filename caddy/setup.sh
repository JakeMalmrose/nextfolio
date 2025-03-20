#!/bin/bash

# Caddy installation and setup script
# Run this on your NUC to set up Caddy manually

# Ensure script stops on error
set -e

echo "Installing Caddy..."

# Determine OS
if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    echo "Debian/Ubuntu detected, using apt..."
    
    # Add Caddy official repository
    sudo apt update
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    
    # Install Caddy
    sudo apt update
    sudo apt install caddy
    
elif [ -f /etc/redhat-release ]; then
    # RHEL/CentOS/Fedora
    echo "RHEL/CentOS/Fedora detected, using dnf/yum..."
    
    # Add Caddy official repository
    sudo dnf install -y 'dnf-command(copr)'
    sudo dnf copr enable @caddy/caddy
    sudo dnf install caddy
    
else
    # Fallback to direct download
    echo "OS not recognized, using direct download method..."
    
    # Download Caddy binary
    curl -sL "https://caddyserver.com/api/download?os=linux&arch=amd64" -o caddy.tar.gz
    tar -xzf caddy.tar.gz
    sudo mv caddy /usr/local/bin/
    sudo chmod +x /usr/local/bin/caddy
    
    # Set up service
    echo "[Unit]
Description=Caddy web server
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/local/bin/caddy reload --config /etc/caddy/Caddyfile
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateDevices=yes
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/caddy.service
    
    sudo mkdir -p /etc/caddy
    sudo systemctl daemon-reload
fi

# Create Caddy directory structure
sudo mkdir -p /var/log/caddy

# Copy Caddyfile
echo "Copying Caddyfile to /etc/caddy/Caddyfile"
sudo cp ./Caddyfile /etc/caddy/

# Start Caddy
echo "Starting Caddy service..."
sudo systemctl enable caddy
sudo systemctl start caddy

echo "Caddy installation complete!"
echo "Your Caddyfile is at /etc/caddy/Caddyfile"
echo "Logs are at /var/log/caddy/"
echo "To check status: sudo systemctl status caddy"
echo "To reload config: sudo caddy reload --config /etc/caddy/Caddyfile"
