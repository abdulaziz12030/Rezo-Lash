Rezo Lash - Hotfix deployment

1) افتح Supabase > SQL Editor.
2) شغّل الملف supabase_schema.sql كاملًا.
3) ارفع المشروع على GitHub أو انسخه كما هو.
4) أعد النشر على Vercel.
5) تأكد من المتغيرات التالية:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ADMIN_PASSWORD

ملاحظات:
- لم يعد middleware يعتمد على crypto، لذلك تم علاج خطأ صفحة الأدمن.
- تمت إضافة الأعمدة الناقصة مثل lash_removal و lower_lashes و removal_option.
- تم توحيد الجدول ليتوافق مع المشروع الحالي ومع البيانات القديمة أيضًا.
