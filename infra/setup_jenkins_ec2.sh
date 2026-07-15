#!/bin/bash
set -euo pipefail

# Provision script for Jenkins + Docker on Amazon Linux 2
# - installs Docker, Docker Compose plugin, OpenJDK, Jenkins
# - mounts attached EBS (assumes /dev/xvdf) to /var/lib/ai-resume
# - clones the repo to /opt/ai-resume and gives ownership to jenkins

REPO_URL="https://github.com/karanamsharmi/AI-Resume-Screening.git"
MOUNT_POINT="/var/lib/ai-resume"
DEVICE="/dev/xvdf"

echo "Updating packages..."
yum update -y

echo "Installing Docker..."
amazon-linux-extras install -y docker
systemctl enable --now docker

echo "Installing Docker Compose plugin..."
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "Installing Java (OpenJDK 11) and Jenkins..."
yum install -y java-11-amazon-corretto
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key || true
yum install -y jenkins

echo "Preparing mount point and filesystem on ${DEVICE}..."
if [ -b "${DEVICE}" ]; then
  # avoid reformatting if filesystem exists
  if ! file -s ${DEVICE} | grep -q ext4; then
    mkfs -t ext4 ${DEVICE} || true
  fi
  mkdir -p ${MOUNT_POINT}
  if ! grep -qs "${MOUNT_POINT}" /proc/mounts; then
    mount ${DEVICE} ${MOUNT_POINT}
  fi
  # persist in fstab if not present
  if ! grep -q "${MOUNT_POINT}" /etc/fstab; then
    echo "${DEVICE}    ${MOUNT_POINT}    ext4    defaults,nofail    0    2" >> /etc/fstab
  fi
else
  echo "Device ${DEVICE} not found; ensure EBS is attached. Skipping mount." >&2
fi

echo "Creating application directories and cloning repo..."
mkdir -p /opt/ai-resume
if [ ! -d /opt/ai-resume/.git ]; then
  git clone ${REPO_URL} /opt/ai-resume
else
  (cd /opt/ai-resume && git pull)
fi

echo "Creating docker/jenkins user and permissions..."
if ! id jenkins &>/dev/null; then
  useradd -m -s /bin/bash jenkins || true
fi
usermod -aG docker jenkins || true
chown -R jenkins:jenkins /opt/ai-resume
mkdir -p ${MOUNT_POINT}/data
chown -R jenkins:jenkins ${MOUNT_POINT}

echo "Starting services..."
systemctl enable --now docker
systemctl enable --now jenkins

echo "Done. Jenkins should be available on port 8080. To finish setup:" 
echo "1) Open EC2 security group to allow inbound 8080 (or use SSH tunnel)."
echo "2) In Jenkins UI, install recommended plugins and add 'docker' group membership to Jenkins agent user if needed."
echo "3) On the Jenkins server, run the pipeline which uses docker compose in /opt/ai-resume."

echo "Example: as 'jenkins' user run:"
echo "  cd /opt/ai-resume"
echo "  docker compose up -d --build"
