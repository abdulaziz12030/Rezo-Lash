# تسجيل دخول الأدمن بالإيميل - Rezo Lash

تم تحويل دخول لوحة التحكم إلى Supabase Auth بدل كلمة مرور عامة.

## المتغيرات المطلوبة في Vercel

أضف هذه المتغيرات من:
Vercel > Project Settings > Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=رابط مشروع Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=مفتاح anon public
SUPABASE_SERVICE_ROLE_KEY=مفتاح service role
ADMIN_SESSION_SECRET=نص طويل عشوائي لتوقيع جلسة الأدمن
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`ADMIN_EMAILS` مهم للحماية. اكتب بريد الأدمن المسموح له بالدخول. ويمكن إضافة أكثر من بريد بفاصلة:

```env
ADMIN_EMAILS=email1@example.com,email2@example.com
```

## إنشاء حساب الأدمن في Supabase

1. افتح Supabase.
2. ادخل إلى Authentication.
3. اختر Users.
4. اضغط Add user.
5. أدخل بريد الأدمن وكلمة مرور قوية.
6. أضف نفس البريد في متغير `ADMIN_EMAILS` في Vercel.

## استعادة كلمة المرور

1. من صفحة تسجيل الدخول اضغط: نسيت كلمة المرور؟
2. أدخل بريد الأدمن.
3. سيصل رابط إعادة التعيين على البريد.
4. افتح الرابط وأدخل كلمة مرور جديدة.

## إعداد رابط الاستعادة في Supabase

في Supabase Authentication > URL Configuration:

- Site URL: رابط موقعك الأساسي.
- Redirect URLs: أضف الرابط التالي:

```txt
https://your-domain.com/admin/reset-password
```

استبدل `your-domain.com` برابط موقع Rezo Lash الفعلي.
