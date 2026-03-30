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

  if (error) {
    throw new Error(error.message);
  }

  const normalized = (data || []).map(normalizeBooking);

  return (
    <main className="container-luxe py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin</p>
          <h1 className="section-title mt-2">لوحة إدارة مواعيد ريم</h1>
          <p className="mt-2 max-w-2xl text-black/60">
            متابعة الحجوزات، فلترة ذكية، تعديل كامل للموعد، وتحديث السعر والعربون بشكل مباشر.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/" className="btn-gold">العودة للموقع</a>
        </div>
      </div>

      <AdminTable bookings={normalized} />
    </main>
  );
}
