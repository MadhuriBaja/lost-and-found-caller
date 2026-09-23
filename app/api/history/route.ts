import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("call_attempts")
      .select(
        `
          id,
          location_id,
          scenario_id,
          result,
          created_at,
          lost_items (
            item_name,
            description,
            lost_when,
            lost_location
          )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Request error:", error);

    return NextResponse.json(
      { error: "Failed to load search history" },
      { status: 500 }
    );
  }
}
