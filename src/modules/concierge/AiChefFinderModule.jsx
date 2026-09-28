import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  RotateCcw,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";

const INTEREST_OPTIONS = [
  {
    key: "fullstack",
    code: "01 // DEV",
    title: "Building Full-Stack Apps",
    desc: "React, APIs, databases, UI/UX, shipping production products",
  },
  {
    key: "cp",
    code: "02 // ALGO",
    title: "Competitive Programming & DSA",
    desc: "Algorithms, data structures, CodeChef Starters, ICPC",
  },
  {
    key: "ai",
    code: "03 // AI",
    title: "AI, ML & Autonomous Agents",
    desc: "LLMs, RAG, autonomous workflows, Gemini API",
  },
  {
    key: "career",
    code: "04 // OPEN SOURCE",
    title: "Career, GSoC & Open Source",
    desc: "Internships, architecture, global open source contributions",
  },
];

const LEVEL_OPTIONS = [
  {
    key: "beginner",
    code: "LVL-1",
    title: "Beginner",
    desc: "Just starting out, mastering core fundamentals",
  },
  {
    key: "intermediate",
    code: "LVL-2",
    title: "Intermediate",
    desc: "Built projects, comfortable with problem solving",
  },
  {
    key: "advanced",
    code: "LVL-3",
    title: "Advanced",
    desc: "Shipped production apps, rated coder, or GSoC contributor",
  },
];

const TEAM_OPTIONS = [
  { key: "solo", code: "INDIVIDUAL", title: "Solo — I execute best alone" },
  { key: "team", code: "SQUAD", title: "Team — Let's build together" },
];

const INTEREST_MAP = {
  fullstack: ["Development", "Hackathon"],
  cp: ["Competitive Programming", "Hackathon"],
  ai: ["Workshop", "Hackathon"],
  career: ["Tech Talk"],
};

const DIFFICULTY_MAP = {
  beginner: ["Beginner-Friendly", "Beginner", "Easy"],
  intermediate: ["Intermediate", "Moderate"],
  advanced: ["Advanced", "Expert", "Hard"],
};

function StepIndicator({ currentStep }) {
  const steps = [1, 2, 3, 4];
  const labels = ["INTEREST", "LEVEL", "FORMAT", "MATCH"];

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all duration-300",
                currentStep > s
                  ? "bg-white text-black border-white"
                  : currentStep === s
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : "bg-zinc-950 text-zinc-600 border-zinc-800"
              )}
            >
              0{s}
            </div>
            <span
              className={cn(
                "text-[9px] font-mono uppercase tracking-widest",
                currentStep >= s ? "text-white" : "text-zinc-600"
              )}
            >
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-10 sm:w-16 h-px mb-5 transition-colors duration-300",
                currentStep > s ? "bg-white" : "bg-zinc-800"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OptionCard({ code, title, desc, selected, onClick }) {
  return (
    <SpotlightCard
      enableTilt
      onClick={onClick}
      className={cn(
        "cursor-pointer p-6 text-left transition-all duration-200",
        selected
          ? "border-white bg-white/10 ring-1 ring-white shadow-[0_0_30px_rgba(255,255,255,0.12)]"
          : "hover:border-white/40"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {code}
        </span>
        <span
          className={cn(
            "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
            selected ? "border-white bg-white" : "border-zinc-700"
          )}
        >
          {selected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
        </span>
      </div>
      <h4 className="font-display font-bold text-white text-base">{title}</h4>
      {desc && (
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{desc}</p>
      )}
    </SpotlightCard>
  );
}

function computeMatch(events, registrations, interest, level, teamPref) {
  const targetCategories = INTEREST_MAP[interest] || [];
  const targetDifficulties = DIFFICULTY_MAP[level] || [];

  const scored = events.map((event) => {
    let score = 40;
    if (targetCategories.includes(event.category)) score += 30;
    if (
      event.difficulty &&
      targetDifficulties.some((d) =>
        event.difficulty.toLowerCase().includes(d.toLowerCase())
      )
    ) {
      score += 20;
    }
    if (
      teamPref === "solo" &&
      event.teamSize &&
      event.teamSize.toLowerCase().includes("individual")
    ) {
      score += 10;
    } else if (
      teamPref === "team" &&
      event.teamSize &&
      !event.teamSize.toLowerCase().includes("individual")
    ) {
      score += 10;
    }
    const regCount = registrations.filter((r) => r.eventId === event.id).length;
    const liveCount = event.registeredCount ?? regCount;
    if (liveCount < event.capacity) score += 8;
    score = Math.min(98, score);
    return { event, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;

  const interestLabel =
    INTEREST_OPTIONS.find((o) => o.key === interest)?.title || interest;
  const levelLabel =
    LEVEL_OPTIONS.find((o) => o.key === level)?.title || level;
  const reason = `Based on your focus on ${interestLabel} at the ${levelLabel} tier, this ${best.event.category} event is your highest-leverage match (${best.score}% compatibility).`;

  return { event: best.event, score: best.score, reason };
}

export default function AiChefFinderModule({
  events,
  registrations,
  onOpenRegister,
}) {
  const [step, setStep] = useState(1);
  const [interest, setInterest] = useState(null);
  const [level, setLevel] = useState(null);
  const [teamPref, setTeamPref] = useState(null);

  const result = useMemo(() => {
    if (step !== 4 || !interest || !level || !teamPref) return null;
    return computeMatch(events, registrations, interest, level, teamPref);
  }, [step, interest, level, teamPref, events, registrations]);

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));
  const handleReset = () => {
    setStep(1);
    setInterest(null);
    setLevel(null);
    setTeamPref(null);
  };

  const canProceed =
    (step === 1 && interest) ||
    (step === 2 && level) ||
    (step === 3 && teamPref);

  return (
    <div className="px-4 py-12 sm:py-16 max-w-3xl mx-auto min-h-screen bg-cyber-grid">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] font-bold tracking-widest uppercase">
            HEAD CHEF AI CONCIERGE
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          ALGORITHMIC EVENT MATCHER.
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto">
          Configure your technical vector in 3 steps to compute your optimal
          CodeChef ABESEC event.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="font-mono uppercase tracking-widest text-zinc-400 text-xs text-center mb-5">
            STEP 01 // SELECT PRIMARY TECH VECTOR
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INTEREST_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                code={opt.code}
                title={opt.title}
                desc={opt.desc}
                selected={interest === opt.key}
                onClick={() => setInterest(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeIn">
          <h2 className="font-mono uppercase tracking-widest text-zinc-400 text-xs text-center mb-5">
            STEP 02 // SELECT EXPERIENCE TIER
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LEVEL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                code={opt.code}
                title={opt.title}
                desc={opt.desc}
                selected={level === opt.key}
                onClick={() => setLevel(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fadeIn">
          <h2 className="font-mono uppercase tracking-widest text-zinc-400 text-xs text-center mb-5">
            STEP 03 // EXECUTION FORMAT
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {TEAM_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                code={opt.code}
                title={opt.title}
                selected={teamPref === opt.key}
                onClick={() => setTeamPref(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="animate-fadeIn">
          <SpotlightCard
            enableTilt
            className="p-6 sm:p-8 border-white/30 shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full border-2 border-white flex flex-col items-center justify-center shrink-0 bg-zinc-950">
                <span className="text-3xl font-bold font-mono text-white">
                  {result.score}%
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  MATCH
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="inline-flex px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-white text-black mb-2">
                  {result.event.category}
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  {result.event.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    {result.event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    {result.event.venue}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <p className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider mb-1">
                // TELEMETRY RATIONALE
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {result.reason}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => onOpenRegister(result.event)}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase font-bold transition"
              >
                <Ticket className="w-4 h-4" />
                Book Holographic Chef Pass
              </button>
              <button
                onClick={handleReset}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono uppercase font-bold border border-zinc-800 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Recalibrate
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {step < 4 && (
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="cursor-pointer flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono uppercase border border-zinc-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="cursor-pointer flex items-center gap-1.5 px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
