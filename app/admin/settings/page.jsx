import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_TIME_SLOTS, formatTimeLabel } from "@/lib/booking";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "time_slots")
    .maybeSingle();

  const currentSlots = data?.value?.slots || DEFAULT_TIME_SLOTS;

  return (
    <main className="container-luxe py-14">
      <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin</p>
      <h1 className="section-title mt-2">إعدادات المواعيد</h1>

      <div className="card-luxe mt-8 p-8">
        <p className="text-sm text-black/60">
          الأوقات الافتراضية: {DEFAULT_TIME_SLOTS.map((slot) => formatTimeLabel(slot).en).join(" , ")}
        </p>

        <form action="/api/settings" method="POST" className="mt-6 space-y-4">
          <input type="hidden" name="key" value="time_slots" />
          <textarea
            name="slots"
            defaultValue={currentSlots.join(",")}
            className="input-luxe min-h-[140px]"
          />
          <button type="submit" className="btn-primary">
            حفظ الإعدادات
          </button>
        </form>
      </div>
    </main>
  );
}
