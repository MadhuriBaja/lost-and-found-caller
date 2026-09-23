import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callAttemptId, turns } = body;

    if (!callAttemptId || !Array.isArray(turns) || turns.length === 0) {
      return NextResponse.json(
        { error: "callAttemptId and at least one turn are required" },
        { status: 400 }
      );
    }

    const rows = turns
      .filter(
        (turn: { speaker?: string; text?: string }) =>
          (turn.speaker === "ai" || turn.speaker === "staff") &&
          typeof turn.text === "string" &&
          turn.text.trim().length > 0
      )
      .map(
        (turn: { speaker: "ai" | "staff"; text: string }, index: number) => ({
          call_attempt_id: callAttemptId,
          speaker: turn.speaker,
          message: turn.text.trim(),
          turn_order: index + 1,
        })
      );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid conversation turns were provided" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("call_turns")
      .insert(rows)
      .select();

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