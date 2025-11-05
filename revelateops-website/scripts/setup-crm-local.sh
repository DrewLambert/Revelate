#!/bin/bash

# CRM Local Setup Script
# This script sets up the CRM system for local development

set -e

echo "🚀 Setting up CRM for local development..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found!"
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo ""
    echo "✅ Created .env.local file"
    echo "⚠️  IMPORTANT: Edit .env.local and add your database connection string!"
    echo ""
    read -p "Press enter when you've updated .env.local with your database URL..."
fi

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🗄️  Step 2: Running database migrations..."
npx prisma migrate deploy

echo ""
echo "🔧 Step 3: Generating Prisma client..."
npx prisma generate

echo ""
read -p "Do you want to seed sample CRM data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding CRM data..."
    npx tsx prisma/seed-crm.ts
    echo "✅ Sample data created!"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  - Dashboard: http://localhost:3000/crm/dashboard"
echo "  - Admin: http://localhost:3000/admin"
echo ""
echo "Happy CRM building! 🎉"
