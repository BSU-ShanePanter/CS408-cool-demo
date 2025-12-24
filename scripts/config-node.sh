#!/bin/bash


# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Nginx is not installed."
    echo "Please run the install-packages.sh script to install nginx."
    exit 1
else
    echo "Nginx is installed continuing with configuration..."
fi

# Make sure NVM is on the path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Check if nvm is installed
if [ -z "$NVM_DIR" ]; then
    echo "nvm is not installed."
    echo "Please run the install-packages.sh script to install nvm."
    exit 1
else
    echo "nvm is installed continuing with configuration..."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed."
    echo "Please run the install-packages.sh script to install PM2."
    exit 1
else
    echo "PM2 is installed continuing with configuration..."
fi


# Install Node.js version 24.1.0 using nvm
nvm install 24.1.0
nvm use 24.1.0
nvm alias default 24.1.0

# Setup PM2 to start on boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
echo "PM2 has been configured to start on boot."
