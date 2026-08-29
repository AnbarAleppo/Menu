# 🌿 مشروع مطعم ومقهى عنبر (Anbar Restaurant Web App)

تطبيق ويب متكامل (**Full-Stack**) لمطعم ومقهى عنبر مبني بأحدث التقنيات: **Next.js 15 (App Router)**، **TypeScript**، **Tailwind CSS**، وقاعدة بيانات ومستودعات تخزين سحابية **Supabase (PostgreSQL & Storage Buckets)**، مع جاهزية تامة للنشر المباشر على منصة **Vercel**.

---

## 🌟 الميزات الرئيسية

1. **الواجهة العامة للزبائن (`/`)**:
   - تصميم فاخر بمعيار **UI/UX PRO-MAX** مع الهوية البصرية الرسمية والخط العربي **Cairo**.
   - صورة المطعم الداخلية الأصلية في القسم الترحيبي مع شارات تفاعلية.
   - استعراض ديناميكي لـ 18 صنفاً أصلياً مصنفاً في 5 فئات رئيسية.
   - بحث فوري وسريع بالأطباق والمكونات والمشروبات.
   - نافذة تفاصيل الطبق السينمائية (المكونات وتوصية المشروب المرافق).
   - سلة طلبات عائمة ودرج منزلق يتيح تحديد رقم الطاولة وإرسال الطلب للمطبخ مباشرة.
   - حساب إجمالي دقيق بالليرة السورية (`ل.س`).

2. **لوحة التحكم والمطبخ (`/admin`)**:
   - **متابعة الطلبات الحية**: استعراض فوري لطلبات الطاولات وتحديث حالتها (`جديد 🟡` -> `قيد التحضير 🔵` -> `تم التقديم 🟢` -> `مكتمل ✅`).
   - **إدارة قائمة الطعام (CRUD)**: إضافة أصناف جديدة، تعديل الأسعار، تغيير التوفر، وحذف الأصناف.
   - **رافع الصور السحابي المباشر**: رفع صور الأطباق مباشرة إلى باكت `anbar-assets` في **Supabase Storage**.

3. **نظام المرونة والتشغيل المحلي**:
   - يعمل التطبيق بكامل وظائفه محلياً حتى قبل إدخال مفاتيح Supabase، وبمجرد إدخال المفاتيح ينتقل تلقائياً للعمل السحابي المتزامن.

---

## 🚀 التشغيل المحلي (Local Development)

```bash
# تثبيت الحزم (إن لم تكن مثبتة)
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على الرابط: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ خطوات ربط Supabase (Database & Storage Bucket)

1. أنشئ حساباً ومشروعاً مجانياً على [Supabase](https://supabase.com).
2. ادخل إلى **SQL Editor** في لوحة تحكم مشروعك في Supabase:
   - افتح الملف [`supabase/schema.sql`](supabase/schema.sql) وانسخ محتواه والصقه واضغط **Run** (سيقوم بإنشاء الجداول وسياسات الأمان وباكت التخزين `anbar-assets`).
   - افتح الملف [`supabase/seed.sql`](supabase/seed.sql) وانسخ محتواه والصقه واضغط **Run** (سيقوم بتغذية القائمة بالأصناف الـ 18 الأصلية).
3. من لوحة تحكم Supabase، اذهب إلى **Project Settings -> API** وانسخ:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`
4. أنشئ أو عدل ملف `.env.local` في المشروع:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=anbar-assets
```

---

## ☁️ خطوات النشر على Vercel (Deployment)

1. ارفع المشروع إلى حسابك في **GitHub**.
2. ادخل إلى [Vercel](https://vercel.com) واضغط **Add New -> Project**.
3. اختر مستودع المشروع من GitHub.
4. في قسم **Environment Variables**، أضف المتغيرات التالية:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
5. اضغط **Deploy** وخلال ثوانٍ سيكون موقعك منشوراً ويعمل عالمياً برابط Vercel السريع مع شهادة SSL مجانية!
