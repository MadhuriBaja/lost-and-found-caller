import { NextResponse } from "next/server";
import { CalleClient } from "@call-e/calle";

export async function GET() {
  const apiKey = process.env.CALLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "CALL-E API key is not configured.",
      },
      { status: 500 }
    );
  }

  try {
    const client = new CalleClient({
      apiKey,
    });

    return NextResponse.json({
      success: true,
      message: "CALL-E SDK connected successfully.",
      sdk: "CalleClient initialized",
    });
  } catch (error) {
    console.error("CALL-E SDK initialization error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize CALL-E SDK.",
      },
      { status: 500 }
    );
  }
}