#!/bin/bash
# Deploy script for VPS
# Usage: bash deploy.sh

set -e

echo "🔄 Pulling latest code..."
git pull

if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
fi

PORT=$(grep -E '^PORT=' .env | cut -d '=' -f2 | tr -d ' "\r' || echo 3000)
echo "🌐 App Port configured: $PORT"

echo "🗑️  Clearing Next.js cache..."
rm -rf .next

echo "⚙️  Generating Prisma Client..."
npx prisma generate

echo "📦 Building..."
npm run build

echo "🔄 Reloading/Restarting PM2 (port $PORT)..."
pm2 startOrRestart ecosystem.config.js

echo "✅ Deploy complete!"
pm2 status audi-motor
