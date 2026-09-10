"use client";

import { useState } from "react";
import { locations } from "./data/locations";
import { demoCalls } from "./data/demoCalls";

type CallResult = {
  possible_match?: "yes" | "no" | "unknown";
  confidence?: number;
  confidence_label?:
    | "High confidence"
    | "Possible match"
    | "No match"
    | "Uncertain";
  staff_summary?: string;
  matched_details?: string;
  next_step?: string;
  contact_status?: string;
};

type CallStage =
  | "idle"
  | "started"
  | "calling"
  | "speaking"
  | "comparing"
  | "completed";

type ConversationTurn = {
  speaker: "ai" | "staff";
  text: string;
};

type HistoryItem = {
  id: number;
  itemName: string;
  description: string;
  locationName: string;
  lostWhen: string;
  result: CallResult;
  mode: "demo" | "live";
  createdAt: string;
};

type DemoScenario = {
  id: string;
  icon: string;
  title: string;
  outcome: string;
  itemName: string;
  description: string;
  lostWhen: string;
  location: string;
};

const callStages = [
  {
    id: "started",
    title: "Search started",
    description: "Preparing your lost-item inquiry",
  },
  {
    id: "calling",
    title: "Calling location",
    description: "Connecting with the selected location",
  },
  {
    id: "speaking",
    title: "AI speaking with staff",
    description: "Asking about your lost item",
  },
  {
    id: "comparing",
    title: "Comparing details",
    description: "Checking the reported item against your description",
  },
  {
    id: "completed",
    title: "Result received",
    description: "Lost & Found search completed",
  },
] as const;

const demoScenarios: DemoScenario[] = [
  {
    id: "backpack",
    icon: "🎒",
    title: "Backpack",
    outcome: "Likely match",
    itemName: "Black backpack",
    description:
      "Black backpack with a small blue keychain and a laptop inside",
    lostWhen: "Yesterday around 6 PM",
    location: "forum-sujana",
  },
  {
    id: "umbrella",
    icon: "☂️",
    title: "Umbrella",
    outcome: "No match",
    itemName: "Red umbrella",
    description:
      "Red umbrella with a wooden handle and a small white logo",
    lostWhen: "Today around 2 PM",
    location: "forum-sujana",
  },
  {
    id: "generic-bag",
    icon: "👜",
    title: "Generic bag",
    outcome: "Uncertain",
    itemName: "Black bag",
    description: "Plain black bag with no distinctive markings. Lost yesterday.",
    lostWhen: "Yesterday",
    location: "forum-sujana",
  },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L9 10.72a16 16 0 0 0 4.28 4.28l1.27-1.27a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3-1.2 4.1L7 8.3l3.8 1.2L12 13l1.2-3.5L17 8.3l-3.8-1.2L12 3Z" />
          <path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7L19 14Z" />
          <path d="m5 14-.6 1.9L2.5 16.5l1.9.6L5 19l.6-1.9 1.9-.6-1.9-.6L5 14Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lostWhen, setLostWhen] = useState("");
  const [message, setMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [result, setResult] = useState<CallResult | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [callStage, setCallStage] = useState<CallStage>("idle");
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [callHistory, setCallHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const validateForm = () => {
    if (!itemName.trim() || !description.trim() || !location || !lostWhen.trim()) {
      setMessage("Please complete all four fields before starting the search.");
      return false;
    }

    if (!locations.find((place) => place.id === location)) {
      setMessage("Please select a valid location.");
      return false;
    }

    return true;
  };

  const calculateDemoMatch = () => {
    const userText = `${itemName} ${description}`.toLowerCase();
    const normalizedText = userText.replace(/[.,!?]/g, " ");
    const featureGroups = [
      { label: "item type", keywords: ["backpack", "bag", "umbrella"] },
      { label: "color", keywords: ["black", "red", "blue", "green", "white", "brown"] },
      {
        label: "distinctive feature",
        keywords: ["keychain", "logo", "wooden handle", "handle", "marking"],
      },
      { label: "contents", keywords: ["laptop", "phone", "wallet", "books", "charger"] },
    ];

    const matchedFeatures: string[] = [];

    for (const group of featureGroups) {
      const matchedKeyword = group.keywords.find((keyword) => normalizedText.includes(keyword));
      if (matchedKeyword) matchedFeatures.push(`${group.label}: ${matchedKeyword}`);
    }

    const descriptionWords = description.trim().split(/\s+/).filter(Boolean);
    const hasDetailedDescription = descriptionWords.length >= 8;
    const hasTimeInformation = lostWhen.trim().length >= 5;
    const featureScore = Math.min(matchedFeatures.length * 18, 72);
    const detailBonus = hasDetailedDescription ? 15 : 0;
    const timeBonus = hasTimeInformation ? 8 : 0;
    const score = Math.min(95, featureScore + detailBonus + timeBonus);

    let possibleMatch: "yes" | "no" | "unknown";
    let confidenceLabel: "High confidence" | "Possible match" | "No match" | "Uncertain";

    if (matchedFeatures.length >= 4 && score >= 80) {
      possibleMatch = "yes";
      confidenceLabel = "High confidence";
    } else if (matchedFeatures.length >= 2 && score >= 40) {
      possibleMatch = "yes";
      confidenceLabel = "Possible match";
    } else if (matchedFeatures.length === 0 || score < 25) {
      possibleMatch = "no";
      confidenceLabel = "No match";
    } else {
      possibleMatch = "unknown";
      confidenceLabel = "Uncertain";
    }

    return {
      possibleMatch,
      score,
      confidenceLabel,
      matchedDetails:
        matchedFeatures.length > 0
          ? `The AI found ${matchedFeatures.length} useful characteristic(s): ${matchedFeatures.join(", ")}.`
          : "The description did not contain enough distinctive characteristics to compare reliably.",
    };
  };

  const sleep = (milliseconds: number) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const addToHistory = (historyResult: CallResult) => {
    const selectedPlace = locations.find((place) => place.id === location);
    const historyItem: HistoryItem = {
      id: Date.now(),
      itemName,
      description,
      locationName: selectedPlace?.name ?? "Unknown location",
      lostWhen,
      result: historyResult,
      mode: demoMode ? "demo" : "live",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setCallHistory((current) => [historyItem, ...current]);
    setSelectedHistoryId(historyItem.id);
  };

  const resetSearchState = () => {
    setMessage("");
    setResult(null);
    setConversation([]);
    setCallStage("idle");
    setSelectedHistoryId(null);
  };

  const handleDemoScenario = (scenario: DemoScenario) => {
    setItemName(scenario.itemName);
    setDescription(scenario.description);
    setLostWhen(scenario.lostWhen);
    setLocation(scenario.location);
    setMessage(`${scenario.title} demo loaded. Run the search to see the full workflow.`);
    setResult(null);
    setConversation([]);
    setCallStage("idle");
    setSelectedHistoryId(null);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDemoSearch = async () => {
    if (!validateForm()) return;

    setIsCalling(true);
    setResult(null);
    setConversation([]);
    setSelectedHistoryId(null);
    setMessage("Search started...");
    setCallStage("started");

    await sleep(650);
    setCallStage("calling");
    setMessage("Simulating a call to the selected location...");

    await sleep(800);
    setCallStage("speaking");
    setMessage("AI is speaking with Lost & Found staff...");

    const selectedScenario =
      demoScenarios.find(
        (scenario) =>
          scenario.itemName.toLowerCase() === itemName.toLowerCase() &&
          scenario.description.toLowerCase() === description.toLowerCase()
      ) ?? demoScenarios[0];

    const demoCall = demoCalls.find((call) => call.scenarioId === selectedScenario.id);

    if (demoCall) {
      for (const turn of demoCall.turns) {
        setConversation((current) => [...current, turn]);
        await sleep(430);
      }
    }

    await sleep(500);
    setCallStage("comparing");
    setMessage("Comparing the reported item with your description...");

    await sleep(800);
    const match = calculateDemoMatch();
    let staffSummary = "";
    let nextStep = "";

    if (match.possibleMatch === "yes") {
      staffSummary =
        "Demo simulation: the Lost & Found team reported an item with characteristics that align with the inquiry.";
      nextStep =
        "In a real search, visit the Lost & Found desk and verify the item's identifying details before collecting it.";
    } else if (match.possibleMatch === "no") {
      staffSummary =
        "Demo simulation: the Lost & Found team reported that no matching item was found.";
      nextStep =
        "In a real search, the AI could retry later or contact the location again if the item may be handed in later.";
    } else {
      staffSummary =
        "Demo simulation: an item may have been reported, but there are not enough distinctive details to establish a reliable match.";
      nextStep =
        "In a real search, provide additional identifying details such as color, brand, markings, contents, or accessories.";
    }

    const demoResult: CallResult = {
      possible_match: match.possibleMatch,
      confidence: match.possibleMatch === "unknown" ? Math.max(25, match.score) : match.score,
      confidence_label: match.confidenceLabel,
      contact_status: "staff_reached",
      staff_summary: staffSummary,
      matched_details: match.matchedDetails,
      next_step: nextStep,
    };

    setResult(demoResult);
    addToHistory(demoResult);
    setCallStage("completed");
    setMessage("Demo search and matching completed.");
    setIsCalling(false);
  };

  const handleLiveSearch = async () => {
    if (!validateForm()) return;

    const selectedLocation = locations.find((place) => place.id === location);
    if (!selectedLocation) return;

    setIsCalling(true);
    setResult(null);
    setConversation([]);
    setSelectedHistoryId(null);
    setCallStage("started");
    setMessage("Search started...");

    try {
      await sleep(500);
      setCallStage("calling");
      setMessage("Connecting to Lost & Found Caller...");

      const response = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName,
          description,
          locationName: selectedLocation.name,
          lostWhen,
        }),
      });

      setCallStage("speaking");
      setMessage("AI is communicating with the location...");
      const data = await response.json();

      if (!response.ok || !data.success) {
        setCallStage("completed");
        setMessage(data.message || "The AI call could not be completed.");
        return;
      }

      setCallStage("comparing");
      setMessage("Processing the information received from staff...");
      await sleep(800);

      const callResult = data.call?.structuredResult as CallResult | undefined;
      setResult(callResult ?? null);
      if (callResult) addToHistory(callResult);

      setCallStage("completed");
      setMessage("Lost & Found AI call completed.");
    } catch (error) {
      console.error("Frontend call error:", error);
      setCallStage("completed");
      setMessage("Something went wrong while connecting to Lost & Found Caller.");
    } finally {
      setIsCalling(false);
    }
  };

  const handleSearch = () => {
    if (demoMode) handleDemoSearch();
    else handleLiveSearch();
  };

  const handleHistorySelect = (historyItem: HistoryItem) => {
    setItemName(historyItem.itemName);
    setDescription(historyItem.description);
    setLocation(
      locations.find((place) => place.name === historyItem.locationName)?.id ?? ""
    );
    setLostWhen(historyItem.lostWhen);
    setResult(historyItem.result);
    setDemoMode(historyItem.mode === "demo");
    setSelectedHistoryId(historyItem.id);
    setConversation([]);
    setCallStage("completed");
    setMessage(`Showing previous ${historyItem.mode === "demo" ? "demo" : "live"} search.`);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearHistory = () => {
    setCallHistory([]);
    setSelectedHistoryId(null);
    setMessage("Search history cleared.");
  };

  const getConfidenceStyle = () => {
    if (result?.confidence === undefined) return "border-slate-200 bg-slate-50 text-slate-600";
    if (result.possible_match === "unknown") return "border-amber-200 bg-amber-50 text-amber-700";
    if (result.confidence >= 80) return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (result.confidence >= 40) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-rose-200 bg-rose-50 text-rose-700";
  };

  const selectedLocation = locations.find((place) => place.id === location);
  const activeStageIndex = callStage === "idle" ? -1 : callStages.findIndex((stage) => stage.id === callStage);
  const resultTone =
    result?.possible_match === "yes"
      ? "emerald"
      : result?.possible_match === "no"
      ? "rose"
      : "amber";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f8fc] text-slate-950">
      {/* Soft background accents */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute right-[-12rem] top-[35rem] h-[30rem] w-[30rem] rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Lost and Found Caller home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
              <Icon name="phone" size={19} />
            </span>
            <span className="text-sm font-extrabold tracking-tight sm:text-base">Lost&Found Caller</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 transition hover:text-slate-950">How it works</a>
            <a href="#search" className="text-sm font-medium text-slate-500 transition hover:text-slate-950">Search</a>
            <a href="#history" className="text-sm font-medium text-slate-500 transition hover:text-slate-950">History</a>
          </nav>

          <a href="#search" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
            Start search <Icon name="arrow" size={16} />
          </a>
        </div>
      </header>

      <div id="top" className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_-45px_rgba(15,23,42,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.13),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(139,92,246,0.09),transparent_30%)]" />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.10)]" />
                Powered by CALL-E
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl sm:leading-[1.02]">
                Search the physical world with an AI phone call.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Lost&Found Caller turns your item description into a focused phone inquiry, then returns a structured recovery result you can act on.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#search" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
                  Find my item <Icon name="arrow" size={17} />
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2"><Icon name="shield" size={15} /> Controlled contacts</span>
                <span className="inline-flex items-center gap-2"><Icon name="sparkles" size={15} /> AI conversation</span>
                <span className="inline-flex items-center gap-2"><Icon name="check" size={15} /> Structured result</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" />
              <div className="relative rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">AI recovery agent</p>
                    <p className="mt-1 font-bold">Lost item inquiry</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><Icon name="phone" size={18} /></span>
                </div>

                <div className="space-y-4 py-5">
                  <div className="rounded-2xl rounded-tl-md bg-white/10 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">AI</p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">“I’m calling about a black backpack with a blue keychain. Has anything matching this been handed in?”</p>
                  </div>
                  <div className="ml-8 rounded-2xl rounded-tr-md bg-blue-600 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Staff</p>
                    <p className="mt-1 text-sm leading-6 text-white">“Yes, we have a black backpack that was handed in yesterday.”</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Recovery signal</p>
                      <p className="mt-1 font-bold text-white">Likely match</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-300">86%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[86%] rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">From lost item to recovery signal.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">A simple workflow designed to make a frustrating search feel clear and actionable.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { number: "01", icon: "file", title: "Describe", text: "Tell the AI what you lost, when, and where." },
              { number: "02", icon: "phone", title: "Call", text: "CALL-E contacts the selected location." },
              { number: "03", icon: "search", title: "Compare", text: "The response is checked against your details." },
              { number: "04", icon: "check", title: "Recover", text: "Get a match signal and clear next step." },
            ].map((step, index) => (
              <div key={step.number} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
                {index < 3 && <div className="absolute right-[-0.9rem] top-1/2 z-10 hidden -translate-y-1/2 text-slate-300 md:block"><Icon name="arrow" size={18} /></div>}
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon name={step.icon} size={20} /></span>
                  <span className="text-xs font-black tracking-widest text-slate-300">{step.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Search workspace */}
        <section id="search" className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_-50px_rgba(15,23,42,0.4)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Search workspace
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Tell us what you lost.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Add enough detail for the AI to ask a useful question and compare the right characteristics.</p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <div className="px-2">
                <p className="text-xs font-bold text-slate-800">Demo mode</p>
                <p className="text-[11px] text-slate-500">No real call</p>
              </div>
              <button
                type="button"
                aria-label="Toggle Demo Mode"
                aria-pressed={demoMode}
                onClick={() => {
                  setDemoMode(!demoMode);
                  resetSearchState();
                }}
                className={`relative h-7 w-12 rounded-full transition ${demoMode ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${demoMode ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="itemName" className="mb-2 block text-sm font-bold text-slate-800">Item name</label>
                  <input
                    id="itemName"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Black backpack"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="lostWhen" className="mb-2 block text-sm font-bold text-slate-800">When did you lose it?</label>
                  <input
                    id="lostWhen"
                    type="text"
                    value={lostWhen}
                    onChange={(e) => setLostWhen(e.target.value)}
                    placeholder="e.g. Yesterday around 6 PM"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="description" className="block text-sm font-bold text-slate-800">Describe the item</label>
                  <span className="text-[11px] font-semibold text-slate-400">More detail = better comparison</span>
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Black backpack with a small blue keychain and a laptop inside"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Icon name="sparkles" size={17} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Tip</p>
                  <p className="text-xs leading-5 text-slate-500">Include color, markings, accessories, and contents when possible.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">Step 2</p>
                  <h3 className="mt-2 text-xl font-black tracking-tight">Choose the location.</h3>
                  <p className="mt-1 text-sm text-slate-500">Select a contact from the verified network.</p>
                </div>
                {selectedLocation && (
                  <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 sm:block">Selected</span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {locations.map((place) => {
                  const isSelected = location === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        setLocation(place.id);
                        setMessage("");
                        setResult(null);
                        setConversation([]);
                        setCallStage("idle");
                        setSelectedHistoryId(null);
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 shadow-sm shadow-blue-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                          <Icon name="map" size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3">
                            <span className="truncate text-sm font-extrabold text-slate-900">{place.name}</span>
                            {isSelected && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Icon name="check" size={13} /></span>}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">{place.city} · {place.contactType}</span>
                          <span className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold ${place.liveCallingEnabled ? "text-emerald-600" : "text-slate-400"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${place.liveCallingEnabled ? "bg-emerald-500" : "bg-slate-300"}`} />
                            {place.liveCallingEnabled ? "Live calling available" : "Contact verification pending"}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Demo scenarios */}
          {demoMode && (
            <div className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Quick demo</p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">Preview three possible outcomes</h3>
                </div>
                <p className="text-xs text-slate-500">No real phone call is placed.</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleDemoScenario(scenario)}
                    disabled={isCalling}
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl">{scenario.icon}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Try</span>
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-slate-900">{scenario.title}</p>
                    <p className="mt-1 text-xs font-bold text-violet-600">{scenario.outcome}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search action */}
          <div className="mt-8 rounded-2xl bg-slate-950 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300"><Icon name={demoMode ? "sparkles" : "phone"} size={19} /></span>
                <div>
                  <p className="text-sm font-bold text-white">{demoMode ? "Ready for a safe product demo?" : "Ready to make a real CALL-E search?"}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{selectedLocation ? `Target: ${selectedLocation.name}` : "Choose a location first"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isCalling}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCalling ? "AI is searching..." : demoMode ? "Run demo search" : "Start AI search"}
                {!isCalling && <Icon name="arrow" size={17} />}
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-medium text-blue-800">
              <span className="mt-0.5 text-blue-600"><Icon name="info" size={17} /></span>
              <p>{message}</p>
            </div>
          )}

          {/* Activity */}
          {callStage !== "idle" && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">CALL-E activity</p>
                  <h3 className="mt-2 text-xl font-black">{isCalling ? "Search in progress" : "Search completed"}</h3>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold ${isCalling ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isCalling ? "animate-pulse bg-blue-600" : "bg-emerald-600"}`} />
                  {isCalling ? "Working" : "Complete"}
                </span>
              </div>

              <div className="mt-7">
                {callStages.map((stage, index) => {
                  const isCompleted = index < activeStageIndex;
                  const isActive = index === activeStageIndex;
                  const isUpcoming = index > activeStageIndex;
                  return (
                    <div key={stage.id} className="relative flex gap-4">
                      {index < callStages.length - 1 && (
                        <div className={`absolute left-[15px] top-8 h-[calc(100%-2px)] w-px ${index < activeStageIndex ? "bg-emerald-300" : "bg-slate-200"}`} />
                      )}
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black ${isCompleted ? "border-emerald-200 bg-emerald-50 text-emerald-600" : isActive ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-slate-200 bg-white text-slate-300"}`}>
                        {isCompleted ? <Icon name="check" size={14} /> : index + 1}
                      </div>
                      <div className={`min-h-[72px] pb-5 transition ${isUpcoming ? "opacity-40" : ""}`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-extrabold ${isActive ? "text-blue-700" : isCompleted ? "text-emerald-700" : "text-slate-500"}`}>{stage.title}</p>
                          {isActive && isCalling && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-blue-700">Current</span>}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{stage.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transcript */}
          {demoMode && conversation.length > 0 && (
            <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/60 p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Conversation preview</p>
                  <h3 className="mt-2 text-xl font-black">AI ↔ Lost & Found staff</h3>
                  <p className="mt-1 text-xs text-slate-500">Simulated transcript for the product demonstration.</p>
                </div>
                <span className="w-fit rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-violet-700">Demo</span>
              </div>

              <div className="mt-6 space-y-3">
                {conversation.map((turn, index) => (
                  <div key={`${turn.speaker}-${index}`} className={`flex ${turn.speaker === "ai" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[88%] rounded-2xl p-4 ${turn.speaker === "ai" ? "rounded-tl-md border border-slate-200 bg-white" : "rounded-tr-md bg-violet-600 text-white"}`}>
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider ${turn.speaker === "ai" ? "text-violet-600" : "text-violet-100"}`}>{turn.speaker === "ai" ? "Lost&Found AI" : "Staff"}</p>
                      <p className={`mt-1 text-sm leading-6 ${turn.speaker === "ai" ? "text-slate-700" : "text-white"}`}>{turn.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className={`border-b px-5 py-6 sm:px-7 ${resultTone === "emerald" ? "border-emerald-100 bg-emerald-50/60" : resultTone === "rose" ? "border-rose-100 bg-rose-50/50" : "border-amber-100 bg-amber-50/50"}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">Step 3 · Recovery result</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">{result.possible_match === "yes" ? "A possible match was found." : result.possible_match === "no" ? "No matching item was reported." : "The result needs more information."}</h3>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${getConfidenceStyle()}`}>
                    {demoMode ? "Simulated result" : "Real CALL-E result"}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {demoMode ? (
                  <div className="mb-6 flex gap-3 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
                    <span className="mt-0.5 text-violet-600"><Icon name="sparkles" size={17} /></span>
                    <div>
                      <p className="text-sm font-bold text-violet-900">Demonstration result</p>
                      <p className="mt-1 text-xs leading-5 text-violet-700">The conversation and staff response are simulated. No real staff member verified this item.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <span className="mt-0.5 text-emerald-600"><Icon name="phone" size={17} /></span>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">CALL-E live result</p>
                      <p className="mt-1 text-xs leading-5 text-emerald-700">This result came from the CALL-E phone-call workflow and its structured response.</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Possible match</p>
                    <p className="mt-2 text-lg font-black text-slate-950">{result.possible_match === "yes" ? "Likely found" : result.possible_match === "no" ? "No match" : "Unknown"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Location contacted</p>
                    <p className="mt-2 text-sm font-black text-slate-950">{selectedLocation?.name ?? "Unknown"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Contact status</p>
                    <p className="mt-2 text-sm font-black capitalize text-slate-950">{result.contact_status?.replaceAll("_", " ") ?? "Unknown"}</p>
                  </div>
                </div>

                {result.confidence !== undefined && (
                  <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-extrabold">{demoMode ? "Demo match score" : "Match confidence"}</p>
                        <p className="mt-1 text-xs text-slate-400">{demoMode ? "Based on item characteristics and description quality" : "Based on information returned from the CALL-E conversation"}</p>
                      </div>
                      <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-extrabold ${getConfidenceStyle()}`}>{result.confidence_label}</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, result.confidence))}%` }} />
                    </div>
                    <div className="mt-2 flex justify-end text-xs font-black text-slate-500">{result.confidence}%</div>
                  </div>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 text-slate-500"><Icon name="sparkles" size={16} /><p className="text-xs font-extrabold uppercase tracking-wide">What the AI found</p></div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{result.staff_summary ?? "No summary available."}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 text-slate-500"><Icon name="search" size={16} /><p className="text-xs font-extrabold uppercase tracking-wide">Why it looks this way</p></div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{result.matched_details ?? "No matching details available."}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center gap-2 text-blue-700"><Icon name="arrow" size={16} /><p className="text-xs font-extrabold uppercase tracking-wide">Recommended next step</p></div>
                  <p className="mt-3 text-sm leading-6 text-blue-950">{result.next_step ?? "No next step available."}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* History */}
        {callHistory.length > 0 && (
          <section id="history" className="scroll-mt-24 mt-10 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">Search history</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Previous searches</h2>
                <p className="mt-1 text-sm text-slate-500">Kept only for this browser session.</p>
              </div>
              <button type="button" onClick={clearHistory} className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                <Icon name="trash" size={14} /> Clear history
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {callHistory.map((historyItem) => {
                const isSelected = selectedHistoryId === historyItem.id;
                const matchLabel = historyItem.result.possible_match === "yes" ? "Likely match" : historyItem.result.possible_match === "no" ? "No match" : "Uncertain";
                const matchStyle = historyItem.result.possible_match === "yes" ? "bg-emerald-50 text-emerald-700" : historyItem.result.possible_match === "no" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700";

                return (
                  <button key={historyItem.id} type="button" onClick={() => handleHistorySelect(historyItem)} className={`w-full rounded-2xl border p-4 text-left transition ${isSelected ? "border-blue-400 bg-blue-50/60" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${historyItem.mode === "demo" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>
                          <Icon name={historyItem.mode === "demo" ? "sparkles" : "phone"} size={17} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold text-slate-900">{historyItem.itemName}</span>
                          <span className="mt-1 block text-xs text-slate-500">{historyItem.locationName} · {historyItem.mode === "demo" ? "Demo" : "Live CALL-E"} · {historyItem.createdAt}</span>
                        </span>
                      </div>
                      <span className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${matchStyle}`}>{matchLabel}</span>
                        {historyItem.result.confidence !== undefined && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{historyItem.result.confidence}%</span>}
                        <Icon name="chevron" size={16} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Lost&Found Caller</p>
              <p className="mt-1 text-xs text-slate-500">AI-powered search for the physical world.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500">
              <a href="#how-it-works" className="transition hover:text-slate-900">How it works</a>
              <a href="#search" className="transition hover:text-slate-900">Search</a>
              <a href="https://call-e.devpost.com/" target="_blank" rel="noreferrer" className="transition hover:text-blue-600">CALL-E ↗</a>
            </div>
          </div>
          <p className="mt-6 pb-2 text-center text-[11px] text-slate-400">Built with CALL-E · Demo locations use controlled contact verification before live calling is enabled.</p>
        </footer>
      </div>
    </main>
  );
}