# منصة Smart - نظام تعليمي متكامل

منصة تعليمية احترافية مثل منصة محمود مجدي، مبنية بـ Next.js و PostgreSQL و Stripe للدفع.

## 🚀 الميزات

- ✅ **قاعدة بيانات PostgreSQL** - قاعدة بيانات حقيقية للإنتاج
- ✅ **نظام دفع Stripe** - دفع آمن ومشفر
- ✅ **إدارة كاملة للكورسات** - إضافة، تعديل، حذف الكورسات
- ✅ **نظام الفيديوهات** - دعم فيديوهات خارجية (YouTube, Vimeo)
- ✅ **نظام الاختبارات** - اختبارات تفاعلية
- ✅ **نظام الوصول** - كودات تفعيل للكورسات
- ✅ **لوحة تحكم الأدمن** - إدارة شاملة
- ✅ **واجهة الطلاب** - تصفح وشراء الكورسات
- ✅ **نظام المصادقة** - تسجيل دخول آمن

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Docker)
- **Payments**: Stripe
- **Authentication**: Custom JWT
- **UI Components**: Radix UI

## 📋 متطلبات التشغيل

- Node.js 18+
- Docker & Docker Compose
- حساب Stripe (للدفع)

## ⚡ التثبيت والإعداد

### 1. تحميل المشروع
```bash
git clone https://github.com/ttlattzttmt-png/smart.git
cd smart
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# تشغيل PostgreSQL
docker-compose up -d

# إنشاء الجداول
npx prisma db push

# إضافة البيانات الأولية
npx tsx prisma/seed.ts
```

### 3. إعداد متغيرات البيئة
قم بتحديث ملف `.env`:
```env
DATABASE_URL="postgresql://smart_user:smart_password@localhost:5432/smart_db?schema=public"

# Stripe (احصل على المفاتيح من https://stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. تشغيل المنصة
```bash
npm run dev
```

## 🎯 استخدام المنصة

### لحساب الأدمن:
- **البريد**: admin@theengineer.com
- **كلمة المرور**: admin123
- **الصفحة**: `/admin/courses` - إدارة الكورسات

### لحساب الطالب:
- **البريد**: student@test.com
- **كلمة المرور**: student123
- **الصفحة**: `/student/courses` - تصفح وشراء الكورسات

## 💳 إعداد الدفع

1. أنشئ حساب على [Stripe](https://stripe.com)
2. احصل على مفاتيح API من لوحة التحكم
3. أضف Webhook endpoint: `http://yourdomain.com/api/payments/webhook`
4. حدث ملف `.env` بالمفاتيح الصحيحة

## 📚 إضافة كورس جديد

1. اذهب إلى `/admin/courses`
2. اضغط "إضافة كورس"
3. املأ البيانات (العنوان، الوصف، الصف، السعر)
4. احفظ الكورس

## 🎥 إضافة فيديوهات

1. اذهب إلى `/admin/videos`
2. اختر الكورس
3. أضف رابط الفيديو (YouTube/Vimeo)
4. حدد الترتيب والمدة

## 🔐 نظام الوصول

- الأدمن يمكنه إنشاء كودات تفعيل للكورسات
- الطلاب يشترون الكورسات ويحصلون على كود تلقائياً
- الكودات تُستخدم لتفعيل الوصول للكورس

## 🚀 النشر للإنتاج

### على Vercel:
1. ارفع الكود إلى GitHub
2. اربط المشروع بـ Vercel
3. أضف متغيرات البيئة في Vercel
4. استخدم PostgreSQL من خدمة مثل Neon.tech أو Supabase

### على خادم خاص:
1. استخدم PM2 لإدارة العملية
2. استخدم Nginx كـ reverse proxy
3. أضف SSL certificate
4. استخدم PostgreSQL production instance

## 🐛 استكشاف الأخطاء

### مشاكل قاعدة البيانات:
```bash
# إعادة تشغيل PostgreSQL
docker-compose restart

# إعادة إنشاء الجداول
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

### مشاكل الدفع:
- تأكد من صحة مفاتيح Stripe
- تحقق من Webhook endpoint
- راجع logs Stripe dashboard

## 📞 الدعم

لأي مشاكل أو أسئلة، يرجى فتح issue على GitHub.

---

**ملاحظة**: هذه منصة تعليمية حقيقية جاهزة للإنتاج مع نظام دفع آمن وإدارة كاملة للمحتوى التعليمي.