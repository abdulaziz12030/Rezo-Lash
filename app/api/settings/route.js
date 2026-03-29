import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const key = formData.get("key");
    const slotsValue = formData.get("slots");

    if (key !== "time_slots") {
      return NextResponse.json({ error: "Invalid settings key" }, { status: 400 });
    }

    const slots = String(slotsValue || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("settings")
      .upsert({
        key: "time_slots",
        value: { slots }
      });

    if (error) {
      throw error;
    }

    return NextResponse.redirect(new URL("/admin/settings", request.url));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("settings")
      .select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json({ settings: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
