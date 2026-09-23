import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      lostItemId,
      locationId,
      scenarioId,
      status,
      matchScore,
      result,
    } = body;

    if (!lostItemId || !locationId) {
      return NextResponse.json(
        { error: "lostItemId and locationId are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("call_attempts")
      .insert({
        lost_item_id: lostItemId,
        location_id: locationId,
        scenario_id: scenarioId || null,
        status: status || "pending",
        match_score: matchScore ?? null,
        result: result || null,
      })
      .select()
      .single();

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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Request error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}