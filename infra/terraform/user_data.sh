#!/bin/bash
set -e

echo "Starting instance initialization..."

# Update system
echo "Updating system packages..."
yum update -y

# Install Docker
echo "Installing Docker..."
amazon-linux-extras install -y docker || yum install -y docker
systemctl enable --now docker

# Install Docker Compose
echo "Installing Docker Compose..."
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install Git
echo "Installing Git..."
yum install -y git

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/ai-resume
cd /opt/ai-resume

# Clone repository
echo "Cloning AI Resume Screening repository..."
git clone https://github.com/karanamsharmi/AI-Resume-Screening.git . || echo "Repository already cloned or not available"

echo "Instance initialization complete!"
