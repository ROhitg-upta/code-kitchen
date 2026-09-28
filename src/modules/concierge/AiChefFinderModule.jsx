/**
 * AiChefFinderModule.jsx
 * ──────────────────────────────────────────────────────────────
 * Module 5 — Head Chef AI Interactive Event Recommender
 *
 * A 3-step wizard that profiles the user's interests, experience
 * level, and team preference, then computes a weighted match score
 * against available events and presents a personalized recommendation.
 *
 * @module  modules/concierge/AiChefFinderModule
 * @see     PROMPTS.md — PROMPT 6
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ================================================================
   Constants — Wizard options & matching map
   ================================================================ */

const INTEREST_OPTIONS = [
  { key: 'fullstack', icon: '💻', title: 'Building Full-Stack Apps', desc: 'React, APIs, databases, UI/UX, shipping products' },
  { key: 'cp', icon: '🧠', title: 'Competitive Programming & DSA', desc: 'Algorithms, data structures, CodeChef, ICPC' },
  { key: 'ai', icon: '🤖', title: 'AI, ML & Agents', desc: 'LLMs, RAG, autonomous agents, Gemini API' },
  { key: 'career', icon: '🚀', title: 'Career, GSoC & Open Source', desc: 'Internships, resume building, open source contributions' },
];

const LEVEL_OPTIONS = [
  { key: 'beginner', icon: '🌱', title: 'Beginner', desc: 'Just starting out, learning the basics' },
  { key: 'intermediate', icon: '⚡', title: 'Intermediate', desc: 'Built a few projects, comfortable with fundamentals' },
  { key: 'advanced', icon: '🔥', title: 'Advanced', desc: 'Shipped production apps, competitive programmer, or GSoC contributor' },
];

const TEAM_OPTIONS = [
  { key: 'solo', icon: '🧑‍💻', title: 'Solo — I work best alone' },
  { key: 'team', icon: '👥', title: 'Team — Let\'s cook together!' },
];

const INTEREST_MAP = {
  fullstack: ['Development', 'Hackathon'],
  cp: ['Competitive Programming', 'Hackathon'],
  ai: ['Workshop', 'Hackathon'],
  career: ['Tech Talk'],
};

const DIFFICULTY_MAP = {
  beginner: ['Beginner-Friendly', 'Beginner', 'Easy'],
  intermediate: ['Intermediate', 'Moderate'],
  advanced: ['Advanced', 'Expert', 'Hard'],
};

/* ================================================================
   Sub-component: StepIndicator
   ================================================================ */

function StepIndicator({ currentStep }) {
  const steps = [1, 2, 3, 4];
  const labels = ['Interest', 'Level', 'Team', 'Result'];

  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                currentStep > s
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : currentStep === s
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-700'
              )}
            />
            <span className={cn(
              'text-[9px] font-mono uppercase tracking-wider',
              currentStep >= s ? 'text-slate-300' : 'text-slate-600'
            )}>
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'w-10 sm:w-14 h-0.5 mb-4 rounded-full transition-colors duration-300',
                currentStep > s ? 'bg-emerald-500' : 'bg-slate-700'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ================================================================
   Sub-component: OptionCard
   ================================================================ */

function OptionCard({ icon, title, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-pointer glass-card p-5 rounded-2xl text-left transition-all duration-200 w-full',
        selected
          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
          : 'hover:border-amber-500/40'
      )}
    >
      <span className="text-2xl block mb-2">{icon}</span>
      <h4 className="font-display font-semibold text-white text-sm">{title}</h4>
      {desc && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>}
    </button>
  );
}

/* ================================================================
   Matching Algorithm
   ================================================================ */

function computeMatch(events, registrations, interest, level, teamPref) {
  const targetCategories = INTEREST_MAP[interest] || [];
  const targetDifficulties = DIFFICULTY_MAP[level] || [];

  // Score each event
  const scored = events.map((event) => {
    let score = 40; // base

    // Category match (+30)
    if (targetCategories.includes(event.category)) score += 30;

    // Difficulty match (+20)
    if (event.difficulty && targetDifficulties.some((d) =>
      event.difficulty.toLowerCase().includes(d.toLowerCase())
    )) {
      score += 20;
    }

    // Team preference match (+10)
    if (teamPref === 'solo' && event.teamSize && event.teamSize.toLowerCase().includes('individual')) {
      score += 10;
    } else if (teamPref === 'team' && event.teamSize && !event.teamSize.toLowerCase().includes('individual')) {
      score += 10;
    }

    // Seat availability bonus (+8)
    const regCount = registrations.filter((r) => r.eventId === event.id).length;
    const liveCount = event.registeredCount ?? regCount;
    if (liveCount < event.capacity) score += 8;

    // Cap at 98
    score = Math.min(98, score);

    return { event, score };
  });

  // Sort by score descending, pick best
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best) return null;

  // Generate reason
  const interestLabel = INTEREST_OPTIONS.find((o) => o.key === interest)?.title || interest;
  const levelLabel = LEVEL_OPTIONS.find((o) => o.key === level)?.title || level;
  const reason = `Based on your interest in ${interestLabel} at the ${levelLabel} level, this ${best.event.category} event aligns perfectly with your goals. ${
    teamPref === 'solo' ? 'As a solo chef, you\'ll thrive in this format.' : 'Team collaboration will amplify your experience here.'
  }`;

  return { event: best.event, score: best.score, reason };
}

/* ================================================================
   AiChefFinderModule — Main exported component
   ================================================================ */

export default function AiChefFinderModule({ events, registrations, onOpenRegister }) {
  const [step, setStep] = useState(1);
  const [interest, setInterest] = useState(null);
  const [level, setLevel] = useState(null);
  const [teamPref, setTeamPref] = useState(null);

  // Compute result when reaching step 4
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
    <div className="px-4 py-10 sm:py-14 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-xs text-amber-300 tracking-wider uppercase">
            AI-Powered
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          🤖 Head Chef AI
        </h1>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">
          Tell me about yourself, and I'll recommend the perfect event.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* ── Step 1: Interest ── */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="font-display font-semibold text-white text-lg text-center mb-5">
            What's your primary tech interest?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTEREST_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                icon={opt.icon}
                title={opt.title}
                desc={opt.desc}
                selected={interest === opt.key}
                onClick={() => setInterest(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Level ── */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <h2 className="font-display font-semibold text-white text-lg text-center mb-5">
            What's your experience level?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LEVEL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                icon={opt.icon}
                title={opt.title}
                desc={opt.desc}
                selected={level === opt.key}
                onClick={() => setLevel(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Team Preference ── */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <h2 className="font-display font-semibold text-white text-lg text-center mb-5">
            Solo chef or team kitchen?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {TEAM_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.key}
                icon={opt.icon}
                title={opt.title}
                selected={teamPref === opt.key}
                onClick={() => setTeamPref(opt.key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Result ── */}
      {step === 4 && result && (
        <div className="animate-fadeIn">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] animate-pulse-glow">
            <h2 className="font-display text-2xl font-bold text-white text-center mb-6">
              🏆 Your Perfect Match!
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Score Circle */}
              <div className="w-24 h-24 rounded-full border-4 border-amber-500/40 flex items-center justify-center shrink-0 bg-amber-500/5">
                <span className="text-4xl font-bold font-mono text-amber-400">
                  {result.score}
                  <span className="text-xl">%</span>
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 mb-2">
                  {result.event.category}
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  {result.event.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {result.event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {result.event.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider mb-1.5">
                💡 Why This Event?
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.reason}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => onOpenRegister(result.event)}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all active:scale-[0.98]"
              >
                <Ticket className="w-4 h-4" />
                Book Your Seat 🎫
              </button>
              <button
                onClick={handleReset}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Buttons (Steps 1-3) ── */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="cursor-pointer flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition"
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
            className="cursor-pointer flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
