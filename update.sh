#!/bin/bash

echo "Updating repository..."
cd /root/app/Dispatchja-Dashboard/
git checkout -- update.sh
git pull
chmod +x ./update.sh
cp ./Caddyfile /etc/caddy/Caddyfile

echo "Rebuilding Web App..."
cd ./dashboard-client && npm install && npm run build
echo "Copying files to caddy directory..."
cp -R ./dist/* /usr/share/caddy/
echo "Restarting caddy server"

echo "Rebuilding API..."
cd /root/app/Dispatchja-Dashboard/dashboard-api && npm install && npm run build
echo "Updating env file..."
cp .env ./dist/
echo "Restarting api..."
forever restart ./dist/main.js

systemctl restart caddy
systemctl reload caddy
