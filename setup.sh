#!/bin/bash

echo "🚀 إعداد منصة Smart التعليمية..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker غير متاح. يرجى تشغيل Docker أولاً."
    exit 1
fi

# Start PostgreSQL
echo "🐘 تشغيل PostgreSQL..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ انتظار PostgreSQL..."
sleep 10

# Install dependencies
echo "📦 تثبيت التبعيات..."
npm install

# Setup database
echo "🗄️ إعداد قاعدة البيانات..."
npx prisma generate
npx prisma db push

# Seed database
echo "🌱 إضافة البيانات الأولية..."
npx tsx prisma/seed.ts

echo "✅ تم الإعداد بنجاح!"
echo ""
echo "📋 معلومات الدخول:"
echo "👨‍💼 الأدمن: admin@theengineer.com / admin123"
echo "👨‍🎓 الطالب: student@test.com / student123"
echo ""
echo "🚀 تشغيل المنصة:"
echo "npm run dev"
echo ""
echo "🌐 المنصة ستعمل على: http://localhost:3000"