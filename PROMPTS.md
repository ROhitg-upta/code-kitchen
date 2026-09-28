# 🔥 ChefOps v2.6 — Module Build Prompts
# Copy-paste each prompt ONE AT A TIME to Gemini 3.8 Flash.
# Each prompt is self-contained with full context.
# Build order: PROMPT 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

---

## ════════════════════════════════════════════════════════
## PROMPT 0 — PROJECT SETUP & GLOBAL CONFIG
## ════════════════════════════════════════════════════════

```
You are building a production-grade React SPA called "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" for a college coding club event management platform at ABES Engineering College. The project already exists at C:\Users\rohit\Desktop\codechef-abesec-events with React 19 + Vite 6 + Tailwind CSS v4 installed.

DO THIS NOW — no explanations, just write the files:

### 1. Install these dependencies (run this command):
```bash
cd C:\Users\rohit\Desktop\codechef-abesec-events && npm install lucide-react canvas-confetti gsap clsx tailwind-merge
```

### 2. Create `src/lib/utils.js`:
```javascript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

### 3. Overwrite `src/index.css` with this exact content:

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-primary: #f59e0b;
    --color-primary-foreground: #07090e;
    --color-destructive: #f43f5e;
    --color-muted-foreground: #94a3b8;
    --color-border: #1e293b;
    --color-card: #0c1018;
    --color-card-foreground: #f8fafc;
    --color-muted: #111827;
    --color-foreground: #f8fafc;
    --color-background: #07090e;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #07090e;
    color: #f8fafc;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, .font-display {
    font-family: 'Space Grotesk', sans-serif;
  }

  .font-mono, code, pre {
    font-family: 'JetBrains Mono', monospace;
  }
}

/* Cyber Grid Background */
.bg-cyber-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(251,146,60,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(251,146,60,0.04) 1px, transparent 1px);
}

/* Glassmorphism Card */
.glass-card {
  background: rgba(12, 16, 24, 0.80);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(30, 41, 59, 0.60);
  border-radius: 16px;
  transition: all 300ms ease;
}
.glass-card:hover {
  border-color: rgba(245, 158, 11, 0.40);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.12);
}

/* Holographic Ticket */
.holo-ticket {
  background: linear-gradient(135deg, rgba(24,28,40,0.95) 0%, rgba(15,18,28,0.98) 50%, rgba(36,23,15,0.95) 100%);
  position: relative;
  overflow: hidden;
}
.holo-ticket::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(245,158,11,0.12) 60deg, rgba(6,182,212,0.12) 120deg, transparent 180deg, rgba(249,115,22,0.1) 240deg, transparent 360deg);
  animation: spin-slow 14s linear infinite;
  pointer-events: none;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUp { animation: slideUp 0.5s ease-out; }

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.15); }
  50% { box-shadow: 0 0 40px rgba(245,158,11,0.3); }
}
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

@keyframes countTick {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #07090e; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #f59e0b; }

/* Noise Texture Overlay */
.noise-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.015;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  z-index: 9999;
}
```

### 4. Overwrite `index.html`:
```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeChef ABESEC | The Code Kitchen — ChefOps v2.6</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#07090e] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-300 noise-overlay">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 5. The file `src/data/initialData.js` already exists. Do NOT modify it.

### 6. Overwrite `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' }
  }
})
```

Run `npm install` after creating the files. Confirm all files are created and deps installed.
```

---

## ════════════════════════════════════════════════════════
## PROMPT 1 — MODULE 1: HOME HUB & FLAGSHIP SPOTLIGHT
## ════════════════════════════════════════════════════════

```
You are building Module 1 of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — a dark-mode college event management platform. This is the LANDING PAGE / HOME HUB.

PROJECT CONTEXT:
- React 19 + Vite 6 + Tailwind CSS v4 (no config file, uses @import "tailwindcss" in CSS)
- Icons: lucide-react (import from 'lucide-react')
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code/data)
- Theme: Dark obsidian (#07090e) canvas, amber/orange (#f59e0b / #ea580c) accents, glassmorphism cards
- Utility: import { cn } from '@/lib/utils'
- File location: Create file at `src/modules/home/HomeModule.jsx`
- This component receives props (see below). It does NOT manage its own state.

DESIGN INSPIRATION: Linear.app, Vercel dashboard, Raycast — dark, clean, glowing borders, micro-animations. NOT generic Bootstrap. Every element should feel premium, interactive, and alive.

PROPS THIS COMPONENT RECEIVES:
```jsx
{
  events,           // Array of event objects (from initialData.js)
  registrations,    // Array of registration objects
  broadcastMsg,     // String — live ticker message from admin (can be empty)
  onNavigate,       // (viewName: string) => void — switches active view
  onOpenRegister,   // (event: object) => void — opens registration modal for an event
  onSelectEvent,    // (event: object) => void — opens Run-of-Show detail modal
}
```

BUILD EXACTLY THIS COMPONENT with these sections top-to-bottom:

### Section 1: Live Broadcast Ticker Bar (Top of page)
- Only render if `broadcastMsg` is not empty
- Full-width amber/orange gradient bar at the very top with a small Zap icon + the message
- Text slides/marquee animation using CSS (overflow hidden + translateX keyframes)
- Height: ~36px. Font: JetBrains Mono, text-xs, uppercase tracking-wide

### Section 2: Interactive Terminal Hero
- Centered content with generous padding (py-20 sm:py-28)
- Background: apply CSS class `bg-cyber-grid` for subtle grid lines
- Top: A small rounded-full pill badge with a blinking green dot + text "CodeChef ABESEC Chapter 2026–27" in JetBrains Mono text-xs
- Center: A glassmorphism terminal-style card (max-w-xl) with:
  - Mono font, amber text: `$ chef init --chapter="ABESEC-2026" --station="Dev+Events"`
  - Blinking cursor animation at the end (1s blink)
  - Subtle amber border glow (use animate-pulse-glow class)
- Below terminal: Large Space Grotesk heading: "Where Code Meets the Kitchen 🔥" (text-4xl sm:text-5xl lg:text-6xl, font-bold, text-white)
- Subtitle below: "Blend debugging with pain, mix deadlines with chai." (text-slate-400, text-lg)
- Two CTA buttons side by side:
  - Primary (amber gradient bg, dark text, rounded-xl, px-6 py-3, font-semibold, shadow-lg shadow-amber-500/25): "Explore Events →" → calls onNavigate('events')
  - Secondary (glass border, slate text, rounded-xl): "Admin Console 🛡️" → calls onNavigate('admin')
- All hero elements should use staggered `animate-slideUp` with increasing animation-delay (0s, 0.1s, 0.2s, etc.) via inline style

### Section 3: Live KPI Counter Strip
- 4 glassmorphism cards in a responsive grid (grid-cols-2 lg:grid-cols-4, gap-4, max-w-4xl mx-auto)
- Each card: glass-card class, p-5, rounded-2xl
- Each has: a lucide icon (Calendar, Users, ShieldCheck, Layers) in amber, a label (text-xs uppercase font-mono text-slate-400), and a BIG number (text-3xl font-bold font-display text-white)
- KPI values computed from props:
  1. "Kitchen Events" → events.length
  2. "Active Chefs" → registrations.length
  3. "Gate Verified" → registrations.filter(r => r.checkedIn).length
  4. "Chapter Stations" → 7 (hardcoded)
- Each number should have a subtle countTick animation on mount

### Section 4: Flagship Event Spotlight
- Only renders if there's an event with `featured: true` in the events array
- A large glassmorphism card (max-w-4xl, mx-auto, p-6 sm:p-8, rounded-3xl) with amber border glow
- Inside the card:
  - Top-left: A small pill badge "🔥 FLAGSHIP EVENT" (bg-amber-500/15, text-amber-300, border border-amber-500/25)
  - Title: event.title in Space Grotesk text-2xl sm:text-3xl font-bold text-white
  - Subtitle: event.subtitle in text-slate-400
  - Meta row: MapPin icon + venue, Calendar icon + date, Clock icon + time (flex wrap, gap-4, text-sm text-slate-300)
  - Tags: event.tags mapped as small pills (bg-slate-800, text-slate-300, border border-slate-700, px-2 py-0.5, rounded-md, text-xs font-mono)
  - **LIVE COUNTDOWN TIMER**: Use useState + useEffect with setInterval(1000ms). Compute days, hours, minutes, seconds remaining until event.date. Display in 4 separate glassmorphism mini-boxes inline (each: bg-slate-900/80, border border-slate-800, rounded-xl, p-3, text-center). Number in text-2xl font-bold font-mono text-amber-400, label below in text-[10px] uppercase text-slate-500. Clear interval on unmount!
  - **SEAT OCCUPANCY BAR**: A horizontal progress bar showing registeredCount/capacity.
    - Bar container: h-2.5, bg-slate-800, rounded-full, overflow-hidden
    - Bar fill: transition-all duration-700, rounded-full
    - Color logic: if occupancy < 0.65 → bg-emerald-500, 0.65-0.85 → bg-amber-500, > 0.85 → bg-rose-500 with animate-pulse
    - Text beside bar: "{registeredCount}/{capacity} Seats" + status text ("Open" / "Filling Fast 🔥" / "Almost Full!")
  - 2 CTA buttons at bottom:
    - "Run-of-Show & Details" (secondary button) → calls onSelectEvent(featuredEvent)
    - "Book Your Seat 🎫" (primary amber gradient button) → calls onOpenRegister(featuredEvent)

### Section 5: Chapter Stations Showcase
- Heading: "⚡ Our Kitchen Stations" (text-2xl font-display font-bold text-white, text-center)
- 4 cards in grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
- Data hardcoded inside component:
  ```
  [
    { icon: "💻", name: "Development Station", tag: "1st Preference", desc: "Full-stack web portals, live dashboards, API integrations, and production deployments.", accent: "amber" },
    { icon: "🎪", name: "Events & Operations", tag: "2nd Preference", desc: "Venue logistics, QR gate check-ins, crowd flow, and zero-fire event execution.", accent: "cyan" },
    { icon: "🧠", name: "Competitive Programming", tag: "Algorithmic Core", desc: "CodeChef Starters, ICPC mocks, and crushing TLEs on global leaderboards.", accent: "purple" },
    { icon: "🎨", name: "Graphics & Production", tag: "Brand & Media", desc: "High-voltage UI kits, cinematic aftermovies, reels, and campus-wide buzz.", accent: "emerald" },
  ]
  ```
- Each card: glass-card, p-5, rounded-2xl, border-l-2 with accent color (border-l-amber-500, border-l-cyan-500, etc.)
  - Top: icon (text-2xl) + tag pill (text-[10px] font-mono uppercase tracking-wider, accent color text)
  - Name: font-display font-semibold text-white
  - Desc: text-sm text-slate-400

### Section 6: Footer
- Simple centered footer: "Crafted with ☕ & Commits for CodeChef ABESEC 2026–27" (text-xs text-slate-500, py-8)
- Below: "Press Ctrl+K to open Command Palette" in font-mono text-[11px] text-slate-600 with a kbd-style inline badge

CRITICAL RULES:
- Export as: `export default function HomeModule({ events, registrations, broadcastMsg, onNavigate, onOpenRegister, onSelectEvent })`
- Use ONLY Tailwind classes — no inline CSS except animation-delay
- Every card must use the `glass-card` CSS class
- Every interactive element must be a <button> with cursor-pointer
- Fully responsive: mobile-first, looks gorgeous on 360px AND 1440px
- Use lucide-react icons everywhere (import each by name)
- The countdown timer MUST actually tick every second using setInterval
- Clean up setInterval in useEffect return function
```

---

## ════════════════════════════════════════════════════════
## PROMPT 2 — MODULE 2: EVENT EXPLORER & RUN-OF-SHOW
## ════════════════════════════════════════════════════════

```
You are building Module 2 of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the EVENTS EXPLORER page with search, filter, sort, and a detailed Run-of-Show timeline modal.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4 (dark theme, #07090e base, amber accents)
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (data)
- Design: Linear.app / Vercel aesthetic — dark glassmorphism cards with amber glow borders
- File: Create `src/modules/events/EventsExplorerModule.jsx`

PROPS:
```jsx
{
  events,           // Array of event objects
  registrations,    // Array of registration objects (to compute live seat counts per event)
  onOpenRegister,   // (event) => void — opens registration modal
  onSelectEvent,    // (event) => void — (unused here, we handle detail modal internally)
}
```

INTERNAL STATE (useState):
- searchQuery: string (default "")
- activeCategory: string (default "All")
- sortMode: string (default "date") — options: "date", "filling", "capacity"
- viewMode: string (default "grid") — options: "grid", "compact"
- selectedEvent: object|null (default null) — when set, opens Run-of-Show modal

BUILD THESE SECTIONS:

### Section 1: Page Header
- "⚡ The Kitchen Menu" — text-3xl font-display font-bold text-white
- Subtitle: "Discover events, check seat availability, and explore the run-of-show timeline." text-slate-400

### Section 2: Search, Filter & Controls Bar
- Full-width flex-wrap bar with gap-3, items-center
- **Search Input**: bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5, with Search icon (lucide) as prefix. Placeholder: "Search events, venues, tags..." — filters events across title, venue, description, and tags array (case-insensitive includes)
- **Category Pills**: Horizontal scrollable row of pill buttons: "All", "Hackathon", "Competitive Programming", "Development", "Workshop", "Tech Talk". Active pill: bg-amber-500/20 text-amber-300 border-amber-500/40. Inactive: bg-slate-800/60 text-slate-400 border-slate-700/60. All pills: rounded-full px-3 py-1.5 text-xs font-medium border cursor-pointer transition
- **Sort Dropdown**: A `<select>` styled as a dark glass button (bg-slate-900 border-slate-800 rounded-xl text-xs font-mono text-slate-300) with options: "Upcoming Date", "Filling Fast 🔥", "Max Capacity"
- **View Toggle**: Two icon buttons (LayoutGrid and List from lucide-react) — active one highlighted amber

### Section 3: Event Cards Grid
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5
- If viewMode === "compact", render as a single-column table-like list instead

**Each Event Card (glass-card, p-5, rounded-2xl, flex flex-col):**
- Category badge pill at top (bg-amber-500/15 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/25 w-fit)
- Title: font-display font-semibold text-lg text-white mt-2 line-clamp-2
- Meta row: Calendar icon + date, Clock icon + time, MapPin icon + venue — each with text-xs text-slate-400, flex items-center gap-1
- Description: text-sm text-slate-400 line-clamp-2 mt-2
- Tags row: flex flex-wrap gap-1.5 mt-3 — each tag as bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-mono
- **Capacity Heatmap Bar**: Container h-2 bg-slate-800 rounded-full overflow-hidden mt-3. Fill div with width as percentage (registeredCount/capacity*100%). Color: <65% → bg-emerald-500, 65-85% → bg-amber-500, >85% → bg-rose-500 animate-pulse. Text beside: "{count}/{capacity} Seats" + "Filling Fast!" if >65%
- **Two CTA Buttons** at bottom (mt-auto pt-4, flex gap-2):
  - "Run-of-Show" — secondary button (bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl px-4 py-2 text-xs font-semibold) → sets selectedEvent
  - "Book Seat 🎫" — primary button (bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-xl px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/25) → calls onOpenRegister(event)

### Section 4: Run-of-Show Detail Modal
- Opens when selectedEvent is not null. Full-screen overlay: fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4
- Modal card: glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-fadeIn

**Modal Content:**
- Close button (absolute top-5 right-5, X icon)
- Category badge + Featured badge (if featured)
- Title: text-2xl font-display font-bold text-white
- Subtitle: text-slate-400 text-sm mt-1

- **Info Grid** (grid-cols-2 gap-3 mt-5): 4 info blocks each with icon + label + value:
  - 📍 Venue: event.venue
  - 🏆 Prize Pool: event.prizePool
  - 👥 Team Size: event.teamSize
  - 📋 Difficulty: event.difficulty

- **Prerequisites** (if exists): bg-slate-900/80 border border-slate-800 rounded-xl p-3 mt-4, text-xs text-slate-300

- **Mentors & Judges** (mt-5): Heading "Mentors & Judges" (font-display font-semibold). Flex wrap of mentor cards — each: bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2. Name in text-sm text-white font-medium, role in text-[11px] text-slate-400, badge as a tiny pill (bg-cyan-500/15 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-md border border-cyan-500/25)

- **⏱️ Hour-by-Hour Execution Timeline** (mt-6): Heading "Run-of-Show Timeline" with Clock icon
  - Render event.agenda array as a vertical timeline
  - Each item: relative, with a vertical line on the left (absolute left-[7px] top-6 bottom-0 w-px bg-slate-700 — except last item)
  - Each item has: a dot (w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-slate-900 absolute left-0 top-1), then content indented (pl-8)
  - Content: time in font-mono text-xs text-amber-400 font-semibold, stage in text-sm text-white font-medium, owner in text-xs text-slate-400 italic
  - Stagger animation: each item gets animate-slideUp with increasing animation-delay

- **Bottom CTAs**: "Book Your Seat 🎫" (primary) + "Close" (secondary)

### Empty State
- When filtered results are 0, show centered: a ChefHat icon (lucide), "No events match your search" text-slate-400, "Try different keywords or clear your filters" text-slate-500 text-sm

SORT LOGIC:
- "date": sort by event.date ascending (upcoming first)
- "filling": sort by (registeredCount/capacity) descending (most full first)
- "capacity": sort by capacity descending

FILTER LOGIC:
- searchQuery filters across: title, venue, description, tags.join(' ') — case-insensitive
- activeCategory: if "All" show everything, else filter where event.category === activeCategory

EXPORT: `export default function EventsExplorerModule({ events, registrations, onOpenRegister })`
Every card MUST use glass-card class. Fully responsive. Mobile: 1 col, Tablet: 2 col, Desktop: 3 col.
```

---

## ════════════════════════════════════════════════════════
## PROMPT 3 — MODULE 3A: REGISTRATION MODAL
## ════════════════════════════════════════════════════════

```
You are building Module 3A of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the STUDENT REGISTRATION MODAL with form validation and duplicate detection.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4 (dark theme, #07090e base, amber accents)
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- Design: Premium dark glassmorphism modal, like Linear/Vercel settings panels
- File: Create `src/modules/registration/RegistrationModal.jsx`

PROPS:
```jsx
{
  event,              // The event object being registered for (has id, title, capacity, registeredCount)
  registrations,      // All registrations array (to check duplicates & compute counts)
  onClose,            // () => void — closes this modal
  onRegister,         // (newRegistration: object) => void — parent handles adding to state
}
```

THE MODAL:
- Overlay: fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4
- Card: glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-fadeIn max-h-[90vh] overflow-y-auto

### Header:
- Close button (absolute top-4 right-4, X icon, rounded-full bg-slate-800 hover:bg-slate-700 p-2)
- "🎫 Book Your Seat" — text-xl font-display font-bold text-white
- Event title below in text-sm text-amber-400 font-mono
- Seat status: "{remaining} seats remaining" — color-coded (emerald if >20, amber if 5-20, rose if <5)

### Form Fields (each with proper validation):
All inputs: bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full transition

1. **Full Name** (required, min 2 chars) — User icon prefix
2. **College Email** (required, should contain @) — Mail icon prefix. Helper text: "Use your @abes.ac.in email"
3. **Year** (required) — <select> dropdown: "1st Year (2026-30)", "2nd Year (2025-29)", "3rd Year (2024-28)", "4th Year (2023-27)"
4. **Branch** (required) — <select>: "CSE", "CSE-AIML", "CSE-DS", "IT", "ECE", "ME", "Other"
5. **WhatsApp Number** (required, exactly 10 digits starting with 6-9) — Phone icon. inputMode="numeric"
6. **GitHub/CodeChef Handle** (optional) — Link icon. Placeholder: "github.com/your-handle"

### Validation Logic:
- On submit, validate all required fields. Show error messages below each invalid field in text-rose-400 text-xs mt-1
- **Duplicate Check**: Before creating registration, check if `registrations.some(r => r.email === inputEmail && r.eventId === event.id)`. If duplicate found, show a warning card: "You're already registered! Your ticket: CC-ABES-XXXX" with a button to view existing pass.
- **Capacity Check**: Compute live count = registrations.filter(r => r.eventId === event.id).length. If count >= event.capacity, show error: "This event is at full capacity. 😔"

### On Successful Submit:
- Generate ticketId: `CC-ABES-${String(Math.floor(1000 + Math.random() * 9000))}`
- Create registration object:
  ```javascript
  {
    id: `reg-${Date.now()}`,
    ticketId,
    eventId: event.id,
    eventTitle: event.title,
    name, email, year, branch, phone, handle,
    stationInterest: 'Development + Events',
    registeredAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    checkedIn: false,
  }
  ```
- Call `onRegister(newRegistration)` — parent will add to state, trigger QR pass, and fire confetti

### Submit Button:
- Full-width, bg-gradient-to-r from-amber-500 to-orange-600, text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition, disabled state with opacity-50 cursor-not-allowed when form is invalid or submitting

EXPORT: `export default function RegistrationModal({ event, registrations, onClose, onRegister })`
```

---

## ════════════════════════════════════════════════════════
## PROMPT 4 — MODULE 3B: HOLOGRAPHIC QR CHEF PASS
## ════════════════════════════════════════════════════════

```
You are building Module 3B of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the HOLOGRAPHIC QR CHEF PASS modal that appears after successful registration.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4. Dark theme, amber accents.
- Icons: lucide-react. CSS class `holo-ticket` is already defined in index.css (provides rotating conic-gradient holographic sheen)
- File: Create `src/modules/registration/QrPassModal.jsx`

PROPS:
```jsx
{
  ticket,           // Registration object: { ticketId, eventTitle, name, email, branch, year, phone, stationInterest, registeredAt, checkedIn }
  onClose,          // () => void
  onJumpToScanner,  // (ticketId: string) => void — optional, bridges to Admin QR Scanner tab
}
```

### QR Code SVG Generator (build this inside the component file):
Create a `DeterministicQrSvg` component that generates a fake but consistent QR-like SVG:
```
function DeterministicQrSvg({ seedString }) {
  const size = 11;
  // FNV-1a hash of seedString
  let hash = 2166136261;
  for (let i = 0; i < seedString.length; i++) {
    hash ^= seedString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // Generate 11x11 grid cells
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size-3) || (r >= size-3 && c < 3);
      const bit = ((hash >>> ((r * size + c) % 28)) ^ (r * 7 + c * 13)) & 1;
      cells.push({ r, c, on: isCorner || bit === 1, corner: isCorner });
    }
  }
  // Render as SVG with viewBox="0 0 11 11", rounded rects
  // Corner cells: fill amber (#d97706), data cells: fill dark (#0f172a)
  // Container: w-32 h-32 p-2 bg-white rounded-xl shadow-inner border-2 border-amber-400/60
}
```

### Pass Layout:
- Overlay: fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn
- Card: holo-ticket class, max-w-lg w-full, rounded-3xl, border border-amber-500/40, shadow-[0_0_60px_rgba(245,158,11,0.22)], p-6 sm:p-8

**Inside the card:**
- Top: Close button (absolute top-5 right-5)
- Badge line: Sparkles icon + "CODECHEF ABESEC // OFFICIAL KITCHEN ENTRY PASS" — text-[11px] font-mono uppercase tracking-widest text-amber-400
- Event title: text-2xl font-bold font-display text-white

- **Status Banner**: bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3, flex between:
  - Left: Status pill — if checkedIn: green "GATE VERIFIED (CHECKED IN)" with ShieldCheck icon, else: amber "CONFIRMED SEAT // READY FOR SCAN" with CheckCircle2 icon
  - Right: Ticket ID with copy button (Copy icon, onClick → navigator.clipboard.writeText, show Check icon for 2s)

- **Perforated Divider**: border-t-2 border-dashed border-slate-700/80 my-6, with two circular cutouts on left and right edges (absolute positioned divs with bg-[#07090e] rounded-full)

- **QR + Student Info Grid**: grid-cols-1 sm:grid-cols-3 gap-5
  - Left: DeterministicQrSvg centered, ticket ID below in font-mono text-[11px] text-amber-300
  - Right (sm:col-span-2): Dark card (bg-slate-950/60 p-4 rounded-2xl border border-slate-800) with:
    - Chef Name & Batch: name bold + branch/year pill
    - College Email + Phone in grid
    - Station interest + timestamp at bottom

- **Action Buttons** (flex gap-3 mt-6):
  - "Print / Save Pass PDF" — secondary button with Printer icon → window.print()
  - "Simulate Gate Scan in Admin" — primary amber gradient button with ScanLine icon → onJumpToScanner(ticket.ticketId) — only show if onJumpToScanner prop exists

EXPORT: `export default function QrPassModal({ ticket, onClose, onJumpToScanner })`
```

---

## ════════════════════════════════════════════════════════
## PROMPT 5 — MODULE 4: ADMIN & OPS COMMAND CENTER
## ════════════════════════════════════════════════════════

```
You are building Module 4 of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the ADMIN & EVENT OPERATIONS COMMAND CENTER. This is the most complex module with 5 tabs.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4. Dark theme (#07090e), amber accents.
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- File: Create `src/modules/admin/AdminOpsModule.jsx`

PROPS:
```jsx
{
  events,             // Array of event objects
  registrations,      // Array of registration objects
  broadcastMsg,       // Current broadcast message string
  adminAuth,          // Boolean — whether admin is authenticated
  onAdminLogin,       // () => void — sets adminAuth to true
  onAddEvent,         // (newEvent: object) => void
  onEditEvent,        // (updatedEvent: object) => void
  onDeleteEvent,      // (eventId: string) => void
  onToggleCheckIn,    // (registrationId: string) => void
  onSetBroadcast,     // (message: string) => void
  onResetData,        // () => void — resets all data to initialData
  onNavigate,         // (view: string) => void
}
```

INTERNAL STATE:
- activeTab: string — "overview" | "crud" | "scanner" | "roster" | "broadcast"
- scanInput: string — ticket ID search in scanner
- scanResult: object|null — found registration
- scanStatus: "idle" | "found" | "already" | "notfound"
- showEventForm: boolean — toggle add/edit event form modal
- editingEvent: object|null — if editing, pre-fill form
- rosterSearch: string — search in student roster
- rosterEventFilter: string — filter by event ("all" or eventId)
- rosterBranchFilter: string — filter by branch ("all" or branch name)
- rosterStatusFilter: string — "all" | "checked" | "pending"

### AUTH GATE:
If `adminAuth` is false, show a centered auth card:
- glass-card, max-w-md, p-8, rounded-3xl
- Shield icon (large, amber)
- "🛡️ Admin & Ops Console" heading
- "Enter the kitchen's back door." subtitle
- **1-Click Demo Login button**: Large amber gradient button "⚡ 1-Click Evaluator Login" → calls onAdminLogin()
- OR: A small text "Or enter PIN" with an input for PIN "2026" → on correct PIN, call onAdminLogin()

### AUTHENTICATED VIEW:

**Tab Bar** (flex gap-1 border-b border-slate-800 px-4):
Tabs: "📊 Overview", "📅 Events", "📷 Scanner", "👥 Roster", "📡 Broadcast"
Active tab: text-amber-400 border-b-2 border-amber-500. Inactive: text-slate-400 hover:text-white.

---

**TAB 1: Ops Overview**
- 4 KPI cards (grid-cols-2 lg:grid-cols-4, glass-card):
  - Total Events (Calendar icon): events.length
  - Total Registrations (Users icon): registrations.length
  - Checked-In (ShieldCheck icon): registrations.filter(r=>r.checkedIn).length
  - Check-In Rate (TrendingUp icon): percentage with 1 decimal
- Below: Seat Heatmap Table — a styled table showing each event with:
  - Event title (truncated), Category badge pill, Date
  - Capacity bar (same color logic: green/amber/rose)
  - Count text: "87/120"
  - Quick actions: Edit (Pencil icon) + Delete (Trash2 icon) buttons

---

**TAB 2: Event CRUD**
- Top: "Add New Event +" button (amber gradient) → opens event form modal
- List of existing events as cards with Edit/Delete buttons
- **Event Form Modal** (for both Add and Edit):
  - Overlay + glass-card modal, max-w-2xl
  - Fields: Title, Subtitle, Category (select), Date (input type=date), Time (text), Venue (text), Capacity (number), Prize Pool (text), Description (textarea), Featured (checkbox toggle)
  - Submit: If editingEvent → onEditEvent(updated), else → onAddEvent(newEvent with id: `evt-${Date.now()}`)
  - Cancel button
- **Reset Demo Data**: Small rose-colored button at bottom: "🔄 Reset to Demo Data" → confirmation → onResetData()

---

**TAB 3: QR Gate Scanner**
- Large centered card, glass-card, max-w-md
- Heading: "📷 Gate Check-In Scanner" with ScanLine icon
- Text input: "Enter Ticket ID (e.g., 9041 or CC-ABES-9041)" — styled dark input with Search icon
- "Scan" button
- On scan:
  - Normalize input: if 4 digits, prepend "CC-ABES-"
  - Search registrations for matching ticketId
  - If NOT FOUND → scanStatus = "notfound", show red error card with shake animation
  - If FOUND + already checkedIn → scanStatus = "already", show amber warning: "Already scanned at {time}"
  - If FOUND + not checked in → scanStatus = "found", show green success card with student details:
    - Name, Email, Branch, Year, Event Title, Ticket ID
    - Large "Mark Gate Verified ✅" button → calls onToggleCheckIn(reg.id), then update scanStatus

- Visual feedback:
  - "found": border-emerald-500 glow, scale animation
  - "already": border-amber-500 glow
  - "notfound": border-rose-500, horizontal shake animation

---

**TAB 4: Student Roster**
- Search bar + 3 filter dropdowns (Event, Branch, Status) in a row
- Table/list of filtered registrations showing:
  - Ticket ID (font-mono text-amber-400), Name, Email, Branch pill, Event, Check-In status badge (green "Checked-In" or yellow "Pending"), Timestamp
  - Click any row's check-in badge to toggle status
- **CSV Export Button**: "📥 Export CSV" — amber outlined button
  - On click: Build CSV string with headers: Ticket ID, Name, Email, Branch, Year, Phone, Event, Station, Check-In, Registered At
  - Create Blob, URL.createObjectURL, trigger download as "registrations_export.csv"
- Show "{count} students" and "{checkedIn} checked-in" summary above table

---

**TAB 5: Broadcast**
- "📡 Live Kitchen Broadcast" heading
- Text input for new broadcast message + "Push Broadcast 📢" button → calls onSetBroadcast(message)
- Current broadcast preview (if broadcastMsg exists): amber-bordered card showing current message
- "Clear Broadcast" button → onSetBroadcast("")

EXPORT: `export default function AdminOpsModule({ events, registrations, broadcastMsg, adminAuth, onAdminLogin, onAddEvent, onEditEvent, onDeleteEvent, onToggleCheckIn, onSetBroadcast, onResetData, onNavigate })`

CRITICAL: This is the longest module. Every tab must be fully functional. Use glass-card for all cards. Responsive. All buttons cursor-pointer. Icons from lucide-react.
```

---

## ════════════════════════════════════════════════════════
## PROMPT 6 — MODULE 5: AI CHEF CONCIERGE
## ════════════════════════════════════════════════════════

```
You are building Module 5 of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the "HEAD CHEF AI" interactive event recommender.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4. Dark theme, amber accents.
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- File: Create `src/modules/concierge/AiChefFinderModule.jsx`

PROPS:
```jsx
{
  events,          // Array of event objects
  registrations,   // Array (to compute seat availability)
  onOpenRegister,  // (event) => void — opens registration for recommended event
}
```

INTERNAL STATE:
- step: number (1, 2, 3, or 4) — current wizard step
- interest: string|null — selected in step 1
- level: string|null — selected in step 2
- teamPref: string|null — selected in step 3
- result: { event, score, reason }|null — computed in step 4

### Page Layout:
- Centered max-w-2xl mx-auto
- Header: Sparkles icon + "🤖 Head Chef AI" — text-3xl font-display font-bold, with subtitle "Tell me about yourself, and I'll recommend the perfect event."
- A step indicator bar showing steps 1-2-3-Result with connecting lines. Active step: amber dot. Completed: emerald dot. Future: slate dot.

### Step 1: "What's your primary tech interest?"
- 4 large interactive cards in a 2x2 grid (glass-card, p-5, rounded-2xl, cursor-pointer, hover:border-amber-500/40):
  1. 💻 "Building Full-Stack Apps" — "React, APIs, databases, UI/UX, shipping products"
  2. 🧠 "Competitive Programming & DSA" — "Algorithms, data structures, CodeChef, ICPC"
  3. 🤖 "AI, ML & Agents" — "LLMs, RAG, autonomous agents, Gemini API"
  4. 🚀 "Career, GSoC & Open Source" — "Internships, resume building, open source contributions"
- Selected card: border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30
- "Next →" button appears after selection

### Step 2: "What's your experience level?"
- 3 cards:
  1. 🌱 "Beginner" — "Just starting out, learning the basics"
  2. ⚡ "Intermediate" — "Built a few projects, comfortable with fundamentals"
  3. 🔥 "Advanced" — "Shipped production apps, competitive programmer, or GSoC contributor"

### Step 3: "Solo chef or team kitchen?"
- 2 cards:
  1. 🧑‍💻 "Solo — I work best alone"
  2. 👥 "Team — Let's cook together!"

### Step 4: Result & Recommendation
On reaching step 4, compute the best matching event:

MATCHING ALGORITHM:
```
interestMap = {
  "fullstack": ["Development", "Hackathon"],
  "cp": ["Competitive Programming", "Hackathon"],
  "ai": ["Workshop", "Hackathon"],
  "career": ["Tech Talk"]
}
```
- Filter events matching the interest's categories
- Prefer events with matching difficulty for the level
- Solo preference slightly prefers "Individual" teamSize events
- Calculate a score out of 98 (never 100 — keeps it human)
- Pick the highest scoring event

RESULT DISPLAY:
- A celebration card (glass-card with amber glow border, animate-pulse-glow)
- "🏆 Your Perfect Match!" heading
- Event title, category badge, date, venue
- Match score as a large circular percentage badge (text-4xl font-bold text-amber-400)
- "Why this event?" — 2-3 lines explaining the match
- "Book Your Seat 🎫" primary button → onOpenRegister(result.event)
- "Start Over" ghost button → resets to step 1

EXPORT: `export default function AiChefFinderModule({ events, registrations, onOpenRegister })`
```

---

## ════════════════════════════════════════════════════════
## PROMPT 7 — MODULE 6: BRANCH BATTLE LEADERBOARD
## ════════════════════════════════════════════════════════

```
You are building Module 6 of "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)" — the LIVE ABESEC BRANCH PARTICIPATION BATTLE leaderboard.

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4. Dark theme, amber accents.
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- File: Create `src/modules/leaderboard/BranchBattleModule.jsx`

PROPS:
```jsx
{
  registrations,  // Array of registration objects (each has a `branch` field)
}
```

### Layout:
- Centered max-w-3xl mx-auto
- Header: Trophy icon + "🏆 ABESEC Branch Participation Battle" — text-3xl font-display font-bold
- Subtitle: "Which branch is dominating the Code Kitchen? Live rankings based on event registrations."

### Leaderboard:
1. Aggregate registrations by `branch` field using .reduce()
2. Sort descending by count
3. Find the max count for bar width calculation

Render each branch as a row:
- Rank badge on left: 🥇 (1st, amber-400), 🥈 (2nd, slate-300), 🥉 (3rd, amber-700), others (slate-500) — large text-2xl
- Branch name: font-display font-semibold text-white text-lg
- Count: font-mono text-amber-400 text-lg font-bold
- Horizontal bar: height h-8, rounded-lg, width = (branchCount / maxCount * 100)%, transition-all duration-700
  - 1st place: bg-gradient-to-r from-amber-500 to-amber-400
  - 2nd place: bg-gradient-to-r from-slate-400 to-slate-300
  - 3rd place: bg-gradient-to-r from-amber-700 to-amber-600
  - Others: bg-slate-700
- Each bar should animate from width 0 to final width on mount (use inline style with transition)
- Tag beside 1st place: "👑 Leading the Kitchen" pill

### Recent Activity Feed:
Below the leaderboard:
- Heading: "⚡ Recent Kitchen Activity"
- Show last 5 registrations (sorted by registeredAt descending)
- Each as a small card: glass-card px-4 py-3 rounded-xl
  - "{name} from {branch} joined {eventTitle}" — name in text-white font-medium, rest in text-slate-400
  - Timestamp on the right in text-[11px] font-mono text-slate-500

EXPORT: `export default function BranchBattleModule({ registrations })`
```

---

## ════════════════════════════════════════════════════════
## PROMPT 8 — MODULE 7: COMMAND PALETTE + APP.JSX ROOT
## ════════════════════════════════════════════════════════

```
You are building the FINAL TWO FILES to complete "CodeChef ABESEC — The Code Kitchen (ChefOps v2.6)":
1. Module 7: Command Palette (`src/modules/command/CommandPalette.jsx`)
2. Root App Orchestrator (`src/App.jsx`)
3. Entry Point (`src/main.jsx`)

PROJECT CONTEXT:
- React 19 + Vite + Tailwind CSS v4. Dark theme, amber accents.
- Icons: lucide-react. Utility: import { cn } from '@/lib/utils'
- Confetti: import confetti from 'canvas-confetti'
- Data: import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from './data/initialData'
- All modules already created at:
  - src/modules/home/HomeModule.jsx
  - src/modules/events/EventsExplorerModule.jsx
  - src/modules/registration/RegistrationModal.jsx
  - src/modules/registration/QrPassModal.jsx
  - src/modules/admin/AdminOpsModule.jsx
  - src/modules/concierge/AiChefFinderModule.jsx
  - src/modules/leaderboard/BranchBattleModule.jsx

---

### FILE 1: `src/modules/command/CommandPalette.jsx`

PROPS:
```jsx
{ isOpen, onClose, events, onNavigate, onSelectEvent, onOpenRegister, onExportCsv }
```

- **Keyboard Listener**: useEffect that listens for Ctrl+K (or Cmd+K) to toggle, and Escape to close
- **Overlay**: fixed inset-0 z-50, centered near top (pt-20), bg-black/75 backdrop-blur-md
- **Palette Card**: max-w-2xl w-full, bg-[#0c1018] border border-amber-500/30, rounded-2xl, shadow-[0_0_50px_rgba(245,158,11,0.15)], overflow-hidden

**Search Input Bar** (top):
- Terminal icon + auto-focused input + ESC badge button
- Placeholder: "Type a command, search events, or jump to Admin..."
- Font-mono text-sm

**Results** (scrollable, max-h-96):
- **Quick Actions section**: 6 action rows, each with icon + label + category + ArrowRight on hover:
  1. "Explore All Kitchen Events" (Calendar icon) → onNavigate('events')
  2. "Ask Head Chef AI: Recommend Event" (Sparkles icon) → onNavigate('ai-finder')
  3. "Live Branch Participation Battle" (Trophy icon) → onNavigate('leaderboard')
  4. "Open Admin QR Gate Scanner" (ScanLine icon) → onNavigate('admin-scanner')
  5. "Open Admin Command Center" (Shield icon) → onNavigate('admin')
  6. "Export Registrations to CSV" (Download icon) → onExportCsv()

- **Events section**: filtered events list, each with Flame icon + title + category/date/venue + "Book Seat" button

- Both sections filtered by query (case-insensitive match on labels, categories, titles, venues)

**Footer**: "CodeChef ABESEC // Command Palette v2.6" + "Press ESC to close"

---

### FILE 2: `src/App.jsx`

This is the ROOT ORCHESTRATOR. It owns ALL state and passes props down to modules.

**STATE (useState):**
```javascript
const [events, setEvents] = useState(() => {
  const saved = localStorage.getItem('chefops-events');
  return saved ? JSON.parse(saved) : INITIAL_EVENTS;
});
const [registrations, setRegistrations] = useState(() => {
  const saved = localStorage.getItem('chefops-registrations');
  return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
});
const [activeView, setActiveView] = useState('home');
const [adminAuth, setAdminAuth] = useState(false);
const [broadcastMsg, setBroadcastMsg] = useState('');
const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
const [registerEvent, setRegisterEvent] = useState(null);
const [viewTicket, setViewTicket] = useState(null);
const [selectedEvent, setSelectedEvent] = useState(null);
```

**LOCALSTORAGE SYNC (useEffect):**
- Whenever `events` changes → localStorage.setItem('chefops-events', JSON.stringify(events))
- Whenever `registrations` changes → localStorage.setItem('chefops-registrations', JSON.stringify(registrations))

**HANDLER FUNCTIONS:**
- handleNavigate(view): If view === '__toggle_cmd__' → toggle cmdPaletteOpen. If view === 'admin-scanner' → setActiveView('admin') + set admin tab to scanner. Else → setActiveView(view).
- handleAddEvent(newEvent): setEvents(prev => [...prev, newEvent])
- handleEditEvent(updated): setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))
- handleDeleteEvent(eventId): setEvents(prev => prev.filter(e => e.id !== eventId)). Also remove associated registrations.
- handleRegister(newReg): setRegistrations(prev => [...prev, newReg]). Also increment the event's registeredCount. Fire confetti! Then setViewTicket(newReg) to show QR pass. Close registration modal.
- handleToggleCheckIn(regId): setRegistrations(prev => prev.map(r => r.id === regId ? {...r, checkedIn: !r.checkedIn} : r))
- handleResetData(): setEvents(INITIAL_EVENTS). setRegistrations(INITIAL_REGISTRATIONS). setBroadcastMsg('').
- handleExportCsv(): Build CSV string from registrations with all fields. Create Blob + URL.createObjectURL + trigger download.
- handleOpenRegister(event): setRegisterEvent(event)
- handleSelectEvent(event): setSelectedEvent(event) — this is used by Home to open Run-of-Show

**CONFETTI on registration:**
```javascript
import confetti from 'canvas-confetti';
// In handleRegister, after adding:
confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b', '#ea580c', '#06b6d4', '#10b981'] });
```

**NAVIGATION BAR:**
- Fixed top (sticky top-0 z-40), bg-[#07090e]/90 backdrop-blur-md border-b border-slate-800/60
- Left: "👨‍🍳 The Code Kitchen" logo text (font-display font-bold text-white text-lg, amber chef hat emoji)
- Center: Nav pills — Home, Events, AI Chef, Battle, Admin — each as button, active: text-amber-400, inactive: text-slate-400
- Right: "🎟️ My Passes" button (shows count badge if registrations.length > 0) + Ctrl+K trigger button (kbd styled)

**MAIN CONTENT:**
Conditionally render the active module:
```jsx
{activeView === 'home' && <HomeModule ... />}
{activeView === 'events' && <EventsExplorerModule ... />}
{activeView === 'ai-finder' && <AiChefFinderModule ... />}
{activeView === 'leaderboard' && <BranchBattleModule ... />}
{activeView === 'admin' && <AdminOpsModule ... />}
```

**GLOBAL MODALS (always mounted, conditionally visible):**
```jsx
{registerEvent && <RegistrationModal event={registerEvent} ... onClose={() => setRegisterEvent(null)} />}
{viewTicket && <QrPassModal ticket={viewTicket} ... onClose={() => setViewTicket(null)} />}
{cmdPaletteOpen && <CommandPalette ... onClose={() => setCmdPaletteOpen(false)} />}
```

---

### FILE 3: `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

EXPORT App as: `export default function App()`

CRITICAL RULES:
- App.jsx is the SINGLE SOURCE OF TRUTH for all state
- Every module receives data via props — no module manages global state
- localStorage sync happens in useEffect watching events and registrations
- Confetti fires on successful registration
- Ctrl+K globally toggles CommandPalette
- All navigation is via activeView state — no React Router needed
- Fully responsive navbar (hamburger on mobile with slide-out drawer)
```

---

## ════════════════════════════════════════════════════════
## BUILD ORDER CHECKLIST
## ════════════════════════════════════════════════════════

```
Send prompts in this exact order:

□ PROMPT 0 — Setup & Config (install deps, create utils, CSS, HTML)
□ PROMPT 1 — Module 1: HomeModule.jsx (Landing Hero + Countdown + KPIs)
□ PROMPT 2 — Module 2: EventsExplorerModule.jsx (Search/Filter + Run-of-Show Modal)
□ PROMPT 3 — Module 3A: RegistrationModal.jsx (Form + Validation + Duplicate Guard)
□ PROMPT 4 — Module 3B: QrPassModal.jsx (Holographic QR Chef Pass)
□ PROMPT 5 — Module 4: AdminOpsModule.jsx (CRUD + Scanner + Roster + CSV + Broadcast)
□ PROMPT 6 — Module 5: AiChefFinderModule.jsx (AI Event Recommender Wizard)
□ PROMPT 7 — Module 6: BranchBattleModule.jsx (Branch Leaderboard)
□ PROMPT 8 — Module 7 + App.jsx + main.jsx (Command Palette + Root Orchestrator)

After all 9 prompts: run `npm run dev` and test at http://localhost:5173
```
