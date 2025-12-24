#!/bin/bash
# This will start the Node.js application using PM2 on an EC2 instance.
# Ensure that you have already configured the application using config-node.sh
# and that the application code is present on the instance.
GITHUB_REPO="CS408-simple-EC2-example"

# IF the application is already running, this will restart it.
# Otherwise, it will start it fresh.

if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed."
    echo "Please run the install-packages.sh script to install PM2."
    exit 1
else
    echo "PM2 is installed continuing with starting the application..."
fi

# Make sure and stop any existing instance of the app so we can update

if pm2 list | grep -q "nodeapp"; then
    pm2 stop nodeapp
fi

# Change to the application directory and update code from git and reinstall dependencies
cd $HOME/$GITHUB_REPO || { echo "Application directory not found!"; exit 1; }
git pull origin main
npm run clean-install

# Now restart the app with PM2 or start it if not already running
if pm2 list | grep -q "nodeapp"; then
    pm2 restart nodeapp
else
    pm2 start npm --name "nodeapp" -- start
    pm2 save
fi
echo "Node.js application has been started with PM2."