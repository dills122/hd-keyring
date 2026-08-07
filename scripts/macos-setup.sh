#!/bin/bash
set -e

echo "Installing nvm..."
brew list nvm &>/dev/null || brew install nvm

echo "Setting up nvm, pnpm, and dependencies..."
nvm use
npm install --global corepack@latest
corepack enable pnpm
pnpm install --frozen-lockfile

echo "Ready to rock! See above for any extra environment-related instructions."
