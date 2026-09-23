import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { itemName, description, lostWhen, lostLocation } = body;

    if (!itemName) {
      return NextResponse.json(
        { error: "Item name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lost_items")
      .insert({
        item_name: itemName,
        description: description || null,
        lost_when: lostWhen || null,
        lost_location: lostLocation || null,
        status: "searching",
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