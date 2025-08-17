#!/usr/bin/env bash

DIR="/home/ft_frontend"

# Move to dir
cd "$DIR/deploy/" || exit

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh;

node -v;
corepack enable;

# install dotenv globally
npm install -g dotenv-cli

# Update packages
npm install

# Copy env
cp "$DIR/.env.proxy" "$DIR/deploy/"
cp "$DIR/.env.proxy" "$DIR/deploy/.env"

# Build
npm run build-proxy

# Stop
screen -XS gs quit >/dev/null || true

# Permissions
chmod +x "$DIR/deploy/.build/run.sh"

# Run frontend
screen -dm -S gs bash -c "cd $DIR/deploy/; source ./.build/run.sh; exec bash"