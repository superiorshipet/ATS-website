# 🚀 ATS-websit - منصة التوظيف الذكية

[![PHP Version](https://img.shields.io/badge/PHP-8.3-blue.svg)](https://php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev)
[![Railway](https://img.shields.io/badge/Railway-Deployed-brightgreen.svg)](https://railway.app)

---

## 📖 نظرة عامة

**ATS-websit** هو نظام متكامل لإدارة التوظيف (Applicant Tracking System) يهدف إلى ربط الباحثين عن عمل مع جهات التوظيف بطريقة ذكية وفعالة.

### 🎯 المميزات الرئيسية

- ✅ **إدارة السير الذاتية** - بناء وتحميل السير الذاتية
- ✅ **البحث عن الوظائف** - تصفح وتصفية الوظائف المتاحة
- ✅ **التقديم الإلكتروني** - تقديم طلبات التوظيف بسهولة
- ✅ **متابعة الطلبات** - تتبع حالة الطلبات المقدمة
- ✅ **لوحات تحكم** - لوحات مخصصة لكل نوع مستخدم
- ✅ **شات بوت ذكي** - مساعد آلي للإجابة على الاستفسارات
- ✅ **إدارة شاملة** - لوحة تحكم إدارية كاملة

---

## 👥 أنواع المستخدمين

| النوع | الوظيفة | الصلاحيات |
|-------|---------|-----------|
| 🎓 **خريج** | باحث عن عمل | بناء سيرة ذاتية، التقديم على وظائف، متابعة الطلبات |
| 🏢 **جهة توظيف** | شركة توظيف | نشر وظائف، إدارة الوظائف، مراجعة المتقدمين |
| 👑 **مدير** | مشرف المنصة | إدارة المستخدمين، مراقبة الوظائف، إحصائيات المنصة |

---

## 🛠️ التقنيات المستخدمة

### Backend
- **PHP 8.3** - لغة البرمجة الخلفية
- **PostgreSQL 15** - قاعدة البيانات
- **PDO** - الاتصال بقاعدة البيانات
- **PHP Built-in Server** - خادم التطوير

### Frontend
- **React 18** - إطار العمل الأمامي
- **TypeScript** - كتابة كود آمن
- **Vite** - أداة البناء والتطوير
- **Tailwind CSS** - التصميم والتنسيق
- **React Router DOM** - التنقل بين الصفحات

### النشر والاستضافة
- **Railway** - منصة النشر السحابي
- **Nixpacks** - بناء وتشغيل التطبيق

---

## 📂 هيكل المشروع

ATS-website/
├── 📁 config/ # إعدادات الموقع
│ └── database.php # الاتصال بقاعدة البيانات
│
├── 📁 controllers/ # التحكم في المنطق
│ ├── AuthController.php # تسجيل الدخول والخروج
│ ├── JobController.php # إدارة الوظائف
│ ├── ApplicationController.php # إدارة التقديمات
│ ├── ProfileController.php # الملف الشخصي
│ ├── AdminController.php # لوحة التحكم الإدارية
│ └── CVController.php # السيرة الذاتية
│
├── 📁 routes/ # المسارات (API)
│ └── api.php # جميع روابط API
│
├── 📁 src/ # واجهة المستخدم (React)
│ ├── 📁 app/
│ │ ├── 📁 pages/ # صفحات الموقع
│ │ │ ├── Auth.tsx # تسجيل الدخول
│ │ │ ├── Home.tsx # الصفحة الرئيسية
│ │ │ ├── Root.tsx # الهيكل العام
│ │ │ ├── 📁 graduates/ # صفحات الخريجين
│ │ │ ├── 📁 employers/ # صفحات الشركات
│ │ │ └── 📁 admin/ # صفحات المدير
│ │ └── 📁 components/ # مكونات مشتركة
│ └── 📁 styles/ # ملفات التنسيق
│
├── 📁 uploads/ # الملفات المرفوعة
│ ├── avatars/ # صور المستخدمين
│ └── resumes/ # ملفات السيرة الذاتية
│
├── 📁 public/ # الملفات العامة
├── index.php # مدخل الباك إند
├── package.json # اعتماديات المشروع
└── README.md # هذا الملف
text


---

## 🚀 تشغيل المشروع محلياً

### المتطلبات الأساسية

- PHP 8.3 أو أحدث
- PostgreSQL 15 أو أحدث
- Node.js 18 أو أحدث
- pnpm أو npm

### الخطوات

#### 1️⃣ استنساخ المشروع

```bash
git clone https://github.com/superiorshipet/ATS-website.git
cd ATS-website

2️⃣ إعداد قاعدة البيانات
bash

# إنشاء قاعدة البيانات
sudo -u postgres psql -c "CREATE DATABASE ats_system;"
sudo -u postgres psql -c "CREATE USER ats_user WITH PASSWORD 'ats123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ats_system TO ats_user;"

# تنفيذ هيكل قاعدة البيانات
sudo -u postgres psql -d ats_system -f database.sql

3️⃣ تثبيت الاعتماديات
bash

# تثبيت اعتماديات الفرونت إند
pnpm install
# أو
npm install

4️⃣ تشغيل الباك إند
bash

php -S localhost:8000

5️⃣ تشغيل الفرونت إند
bash

# في نافذة طرفية جديدة
pnpm run dev
# أو
npm run dev

6️⃣ فتح المتصفح
text

http://localhost:3000

🔑 بيانات الدخول التجريبية
النوع	البريد الإلكتروني	كلمة المرور
👑 مدير	admin@ats.com	admin123
🎓 خريج	graduate@test.com	123456
🏢 شركة	company@test.com	123456
📡 API Endpoints
المصادقة (Authentication)
الطريقة	المسار	الوظيفة
POST	/api/auth/login	تسجيل الدخول
POST	/api/auth/register	إنشاء حساب
الوظائف (Jobs)
الطريقة	المسار	الوظيفة
GET	/api/jobs	جلب جميع الوظائف
GET	/api/jobs/{id}	جلب وظيفة محددة
POST	/api/jobs	إضافة وظيفة جديدة
PUT	/api/jobs/{id}	تحديث وظيفة
DELETE	/api/jobs/{id}	حذف وظيفة
التقديمات (Applications)
الطريقة	المسار	الوظيفة
POST	/api/applications	تقديم على وظيفة
GET	/api/applications	جلب تقديمات المستخدم
الملف الشخصي (Profile)
الطريقة	المسار	الوظيفة
GET	/api/profile	جلب الملف الشخصي
PUT	/api/profile	تحديث الملف الشخصي
الإدارة (Admin)
الطريقة	المسار	الوظيفة
GET	/api/admin/users	جلب جميع المستخدمين
GET	/api/admin/stats	جلب إحصائيات المنصة
🚢 النشر على Railway
الطريقة التلقائية

    ادفع الكود إلى GitHub

    أنشئ حساب على Railway

    اختر "Deploy from GitHub repo"

    اختر المستودع

    أضف متغيرات البيئة

المتغيرات المطلوبة
env

DATABASE_URL=postgresql://user:pass@host:port/database
VITE_API_URL=https://your-app.up.railway.app/api

الطريقة اليدوية
bash

# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# النشر
railway up

# إضافة قاعدة البيانات
railway add

🧪 اختبار API
bash

# اختبار تسجيل الدخول
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ats.com","password":"admin123"}'

# جلب الوظائف
curl http://localhost:8000/api/jobs

# جلب إحصائيات المنصة
curl http://localhost:8000/api/admin/stats

🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

    Fork المشروع

    أنشئ فرعاً جديداً (git checkout -b feature/amazing-feature)

    أضف التغييرات (git commit -m 'Add some amazing feature')

    ادفع التغييرات (git push origin feature/amazing-feature)

    افتح Pull Request

📝 الترخيص

هذا المشروع مرخص تحت MIT License.
📞 التواصل

    البريد الإلكتروني: support@ats-website.com

    الموقع: https://ats-website-production.up.railway.app

    GitHub: https://github.com/superiorshipet/ATS-website

🙏 الشكر والتقدير

شكر خاص لجميع المساهمين في هذا المشروع.
<div align="center"> <sub>Built with ❤️ by the ATS Team</sub> </div> EOF ```
