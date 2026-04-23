التعديلات المنفذة:
1) توحيد أسماء أعمدة bookings على الصيغة الجديدة:
   full_name, service_id, service_name, service_price, deposit_amount, booking_date, booking_time...
2) إضافة ترحيل تلقائي للبيانات القديمة من name/service/date/time إلى الأعمدة الجديدة.
3) إصلاح endpoint الحجز checkout مع:
   - التحقق من رقم الجوال السعودي
   - منع الحجز في وقت سابق
   - حفظ style / lower_lashes / lash_removal
4) إصلاح endpoint التوافر availability ليقرأ:
   - settings.time_slots
   - الحجوزات الفعلية
   - المواعيد المنتهية في نفس اليوم
5) إصلاح تحديث الحجز من لوحة الأدمن.
6) حذف مجلد rezo-lash-final الداخلي لتقليل الارتباك.

بعد رفع المشروع:
- نفذ ملف supabase_schema.sql كاملًا داخل Supabase SQL Editor.
- تأكد من ضبط المتغيرات:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  ADMIN_PASSWORD
  ADMIN_SESSION_SECRET
