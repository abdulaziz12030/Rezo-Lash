import AdminTable from "@/components/AdminTable";
import { createWhatsAppMessage } from "@/lib/booking";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const enriched = (data || []).map((booking) => ({
    ...booking,
    whatsapp_url: whatsappNumber
      ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(createWhatsAppMessage({ booking }))}`
      : ""
  }));

  return (
    <main className="container-luxe py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin</p>
          <h1 className="section-title mt-2">لوحة الحجوزات</h1>
        </div>

        <div className="flex gap-3">
          <a href="/admin/settings" className="btn-gold">
            إعدادات المواعيد
          </a>
        </div>
      </div>

      <div className="mt-8">
        <AdminTable bookings={enriched} />
      </div>
    </main>
  );
}
