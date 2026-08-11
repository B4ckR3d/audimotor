#!/bin/bash
# Deploy script for VPS
# Usage: bash deploy.sh

set -e

echo "🔄 Pulling latest code..."
git pull

echo "🗑️  Clearing Next.js cache..."
rm -rf .next

echo "⚙️  Generating Prisma Client..."
npx prisma generate

echo "📦 Building..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart audi-motor

echo "✅ Deploy complete!"
pm2 status audi-motor
