import AdminTable from "@/components/AdminTable";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.full_name || "",
    phone: row.phone || "",
    service: row.service_name || "",
    date: row.booking_date || "",
    time: row.booking_time || "",
    price: row.service_price ?? 0,
    deposit: row.deposit_amount ?? 0,
    status: row.status || "pending",
    created_at: row.created_at || "",
    style: row.style || "",
    lower_lashes: row.lower_lashes ?? false,
    lash_removal: row.lash_removal ?? false,
    removal_option: row.removal_option || "no-removal",
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
    <main className="container-luxe py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin</p>
          <h1 className="section-title mt-2">لوحة الحجوزات</h1>
          <p className="mt-2 text-black/60">إدارة الحجوزات، تحديث الحالات، واستعراضها بطريقة أوضح من نفس اللوحة.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/calendar" className="btn-primary">كالندر المواعيد</a>
          <a href="/admin/settings" className="btn-gold">إعدادات المواعيد</a>
          <a href="/" className="btn-gold">العودة للموقع</a>
        </div>
      </div>
      <div className="mt-8"><AdminTable bookings={normalized} /></div>
    </main>
  );
}
