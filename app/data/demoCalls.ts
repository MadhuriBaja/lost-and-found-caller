export type DemoCallTurn = {
  speaker: "ai" | "staff";
  text: string;
};

export type DemoCall = {
  scenarioId: string;
  title: string;
  turns: DemoCallTurn[];
};

export const demoCalls: DemoCall[] = [
  {
    scenarioId: "backpack",
    title: "Lost Backpack",
    turns: [
      {
        speaker: "ai",
        text: "Hi, I'm an AI assistant calling regarding a lost item. Can you help with lost-and-found inquiries?",
      },
      {
        speaker: "staff",
        text: "Yes, I can help with lost-and-found.",
      },
      {
        speaker: "ai",
        text: "A black backpack was reportedly lost yesterday around 6 PM. It has a small blue keychain and a laptop inside. Has anything matching that description been handed in?",
      },
      {
        speaker: "staff",
        text: "Yes, we have a black backpack that was handed in yesterday evening.",
      },
      {
        speaker: "ai",
        text: "Does it have a small blue keychain, and is there a laptop inside?",
      },
      {
        speaker: "staff",
        text: "Yes. It has a blue keychain and there is a laptop inside.",
      },
      {
        speaker: "ai",
        text: "Thank you. I'll report this as a possible match and let the person know to verify it at the customer care desk.",
      },
      {
        speaker: "staff",
        text: "You're welcome.",
      },
    ],
  },

  {
    scenarioId: "umbrella",
    title: "Lost Umbrella",
    turns: [
      {
        speaker: "ai",
        text: "Hi, I'm an AI assistant calling regarding a lost item. Can you help with lost-and-found inquiries?",
      },
      {
        speaker: "staff",
        text: "Yes, what item are you looking for?",
      },
      {
        speaker: "ai",
        text: "A red umbrella with a wooden handle and a small white logo was reportedly lost today around 2 PM. Has one been handed in?",
      },
      {
        speaker: "staff",
        text: "No, we haven't received a red umbrella matching that description.",
      },
      {
        speaker: "ai",
        text: "Understood. Should the person check again later in case another item is handed in?",
      },
      {
        speaker: "staff",
        text: "Yes, they can check with customer care later.",
      },
      {
        speaker: "ai",
        text: "Thank you. I'll record that no matching item was reported and recommend checking again later.",
      },
      {
        speaker: "staff",
        text: "Sure.",
      },
    ],
  },

  {
    scenarioId: "generic-bag",
    title: "Generic Black Bag",
    turns: [
      {
        speaker: "ai",
        text: "Hi, I'm an AI assistant calling regarding a lost item. Can you help with lost-and-found inquiries?",
      },
      {
        speaker: "staff",
        text: "Yes, I can help.",
      },
      {
        speaker: "ai",
        text: "A plain black bag was reportedly lost yesterday. Has a black bag been handed in?",
      },
      {
        speaker: "staff",
        text: "We do have a black bag, but we don't have enough identifying details to confirm whether it is the same one.",
      },
      {
        speaker: "ai",
        text: "Understood. Are there any additional markings or identifying features recorded for the bag?",
      },
      {
        speaker: "staff",
        text: "No, nothing distinctive was recorded.",
      },
      {
        speaker: "ai",
        text: "Thank you. I'll report this as uncertain and recommend providing additional identifying details before claiming the item.",
      },
      {
        speaker: "staff",
        text: "Okay.",
      },
    ],
  },
];