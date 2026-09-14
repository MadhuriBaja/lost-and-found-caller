import { NextResponse } from "next/server";
import { CalleClient } from "@call-e/calle";
import { locations } from "../../data/locations";

type CallRequest = {
  itemName: string;
  description: string;
  locationName: string;
  lostWhen: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.CALLE_API_KEY;
    const demoCallPhone = process.env.DEMO_CALL_PHONE;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "CALL-E API key is not configured.",
        },
        { status: 500 }
      );
    }

    if (!demoCallPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Controlled test phone number is not configured.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<CallRequest>;

    const itemName = body.itemName?.trim();
    const description = body.description?.trim();
    const locationName = body.locationName?.trim();
    const lostWhen = body.lostWhen?.trim();

    if (!itemName || !description || !locationName || !lostWhen) {
      return NextResponse.json(
        {
          success: false,
          message:
            "itemName, description, locationName, and lostWhen are required.",
        },
        { status: 400 }
      );
    }

    const selectedLocation = locations.find(
      (place) =>
        place.name.toLowerCase() === locationName.toLowerCase()
    );

    if (!selectedLocation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected location is not available in the Lost&Found contact database.",
        },
        { status: 404 }
      );
    }

    if (!selectedLocation.liveCallingEnabled) {
      return NextResponse.json(
        {
          success: false,
          message:
            `${selectedLocation.name} is not enabled for live calling yet.`,
        },
        { status: 400 }
      );
    }

    const phoneNumber = demoCallPhone.trim();

    if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The controlled test phone number must use international E.164 format.",
        },
        { status: 500 }
      );
    }

    const client = new CalleClient({
      apiKey,
      baseUrl: "https://api.heycall-e.com",
    });

    const task = `
You are Lost&Found Caller, an AI assistant helping someone recover a lost item.

Call the recipient and politely ask about the lost item.

You are contacting:
${selectedLocation.name}

Contact type:
${selectedLocation.contactType}

Lost item:
${itemName}

Description:
${description}

Approximate time lost:
${lostWhen}

Conversation rules:

1. Introduce yourself as an AI assistant helping someone locate a lost item.

2. Ask who you are speaking with and whether they handle lost-and-found matters.

3. Wait for the recipient to answer before continuing.

4. If they are not responsible for lost-and-found, politely ask whether they can direct you to the correct department.

5. If they handle lost-and-found, explain the item details and ask whether a matching item has been found or handed in.

6. If they report a possible item, compare only non-sensitive characteristics such as:
   - color
   - item type
   - visible markings
   - accessories
   - general contents

7. Never ask for:
   - passwords
   - OTPs
   - payment information
   - government identification numbers
   - private information about another person

8. Never claim the item definitely belongs to the user.

9. Determine the final result:
   - yes = possible match
   - no = no matching item reported
   - unknown = inquiry could not be completed

10. Ask about the appropriate next step when possible.

11. Thank the recipient and end the call politely.

Keep the conversation natural, short, and focused.
`;

    console.log("Starting CALL-E call...");
    console.log("Recipient:", phoneNumber);
    console.log("Location:", selectedLocation.name);

    const call = await client.calls.createAndWait(
      {
        task,

        recipients: [
          {
            phones: [phoneNumber],
            region: "IN",
            locale: "en-IN",
          },
        ],

        resultSchema: {
          type: "object",
          required: [
            "possible_match",
            "staff_summary",
            "matched_details",
            "next_step",
            "contact_status",
          ],
          properties: {
            possible_match: {
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            staff_summary: {
              type: "string",
            },
            matched_details: {
              type: "string",
            },
            next_step: {
              type: "string",
            },
            contact_status: {
              type: "string",
              enum: [
                "staff_reached",
                "wrong_department",
                "could_not_reach_staff",
                "unknown",
              ],
            },
          },
        },

        recipientResultSchema: {
          type: "object",
          required: [
            "possible_match",
            "staff_summary",
            "next_step",
          ],
          properties: {
            possible_match: {
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            staff_summary: {
              type: "string",
            },
            next_step: {
              type: "string",
            },
          },
        },

        metadata: {
          workflow: "lost-and-found-caller",
          location: selectedLocation.name,
        },
      },
      {
        idempotencyKey: `lost-found-${Date.now()}`,
      }
    );

    const recipient = call.recipients?.[0];

    console.log("CALL-E call status:", call.status);
    console.log("CALL-E recipient:", recipient);

    return NextResponse.json({
      success: true,

      message: "CALL-E request completed.",

      callStatus: call.status,

      taskCompleted: call.taskCompleted,

      completionConfidence: call.completionConfidence,

      evidence: call.evidence,

      location: {
        id: selectedLocation.id,
        name: selectedLocation.name,
        city: selectedLocation.city,
        contactType: selectedLocation.contactType,
      },

      recipient: recipient
        ? {
            status: recipient.status,
            phones: recipient.phones,
            structuredResult: recipient.structuredResult,
            attempts: recipient.attempts,
          }
        : null,

      call,
    });
  } catch (error) {
    console.error("CALL-E error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown CALL-E error";

    return NextResponse.json(
      {
        success: false,
        message: "CALL-E failed to process the Lost&Found call.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}