import AdminTable from "@/components/AdminTable";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.full_name || row.name || "",
    phone: row.phone || "",
    service: row.service_name || row.service || "",
    service_id: row.service_id || "",
    date: row.booking_date || row.date || "",
    time: row.booking_time || row.time || "",
    price: row.service_price ?? row.price ?? 0,
    deposit: row.deposit_amount ?? row.deposit ?? 0,
    status: row.status || "pending",
    created_at: row.created_at || "",
    style: row.style || "",
    lower_lashes: row.lower_lashes ?? false,
    lash_removal: row.lash_removal ?? false,
    removal_option:
      row.removal_option || (row.lash_removal ? "needs-removal" : "no-removal"),
    payment_status: row.payment_status || "unpaid",
    notes: row.notes || "",
  };
}

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const normalized = (data || []).map(normalizeBooking);

  return (
    <main className="admin-shell" dir="rtl">
      <aside className="admin-sidebar">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Rezo Lash</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">لوحة التحكم</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">إدارة الحجوزات والطلبات بشكل مخصص للابتوب.</p>
        </div>

        <nav className="mt-8 space-y-2">
          <a className="admin-nav-item admin-nav-active" href="/admin">الحجوزات</a>
          <a className="admin-nav-item" href="/admin/settings">أوقات المواعيد</a>
          <a className="admin-nav-item" href="/admin/password">كلمة المرور</a>
          <a className="admin-nav-item" href="/">عرض الموقع</a>
        </nav>

        <form action="/api/admin-logout" method="POST" className="mt-auto pt-8">
          <button className="admin-logout" type="submit">تسجيل خروج</button>
        </form>
      </aside>

      <section className="admin-content">
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 lg:hidden">
          لوحة التحكم مصممة للعمل الأفضل على اللابتوب. الصفحات العامة والحجز تبقى مناسبة للجوال.
        </div>

        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin</p>
            <h2 className="section-title mt-2">طلبات وحجوزات Rezo Lash</h2>
            <p className="mt-2 max-w-2xl text-black/60">
              جدول صفوف واضح، فلاتر جانبية، وحالة بصرية ملوّنة لكل طلب.
            </p>
          </div>
        </div>

        <AdminTable bookings={normalized} />
      </section>
    </main>
  );
}
