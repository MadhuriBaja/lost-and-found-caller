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
            `${selectedLocation.name} is not enabled for live calling yet. A verified contact number is required before a real CALL-E call can be made.`,
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
    });

    const task = `
You are Lost&Found Caller, an AI assistant helping a person recover a lost item.

You are calling the ${selectedLocation.name} main contact number.

The contact type for this location is:
${selectedLocation.contactType}

Your job is to communicate with the person who answers the phone and determine whether the lost item may have been found.

IMPORTANT CONVERSATION RULES:

1. Start politely and clearly identify yourself as an AI assistant calling about a lost item.

2. Ask who you are speaking with and whether they handle lost-and-found matters.

3. Listen carefully and WAIT for the person to respond after each question. Do not continue speaking over them.

4. If the person is NOT responsible for lost-and-found:
   - Politely ask whether they can connect you to customer care, security, reception, or the lost-and-found team.
   - If they cannot transfer you, ask whether they know the appropriate department or contact point.
   - Do not become repetitive.

5. If the person IS responsible for lost-and-found:
   - Explain that you are helping someone search for a lost item.
   - Give the item details clearly.
   - Ask whether an item matching the description has been found or handed in.

6. Lost item information:

Item:
${itemName}

Description:
${description}

Approximate time lost:
${lostWhen}

7. If they say an item has been found:
   - Ask only a few non-sensitive characteristics to compare it with the user's description.
   - Examples include color, type, visible markings, accessories, or general contents.
   - Do not ask for passwords, OTPs, payment information, government IDs, or other sensitive information.
   - Do not ask them to reveal private information about another person.

8. If they say nothing has been found:
   - Ask whether the item could still be logged later.
   - Ask what the appropriate next step would be.

9. If the person cannot help:
   - Politely end the call and record that the inquiry could not be completed.

10. Never claim that the item definitely belongs to the user.
    Only report a POSSIBLE MATCH when the information provided by the recipient reasonably matches the lost-item description.

11. Before ending the conversation, determine one of these outcomes:
   - YES: possible match
   - NO: no matching item reported
   - UNKNOWN: the inquiry could not be completed or there was insufficient information

12. Thank the person for their time.

Keep the conversation natural, short, polite, and focused on the lost item.
`;

    const call = await client.calls.createAndWait({
      recipients: [
        {
          phones: [phoneNumber],
        },
      ],
      task,
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
        additionalProperties: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lost&Found AI call completed successfully.",
      location: {
        id: selectedLocation.id,
        name: selectedLocation.name,
        city: selectedLocation.city,
        contactType: selectedLocation.contactType,
      },
      call,
    });
  } catch (error) {
    console.error("Lost&Found CALL-E error:", error);

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