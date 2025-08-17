#!/usr/bin/env bash

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh;

node -v;
corepack enable;

npx next start