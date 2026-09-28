# 🎨 UI/UX Design System — "Cyber-Kitchen Dark Glassmorphism"
### Visual Language, Design Tokens, Motion System & Accessibility Spec

| Meta | Detail |
|:---|:---|
| **Theme Name** | Cyber-Kitchen Dark Glassmorphism |
| **Design Inspiration** | Linear · Vercel · Raycast · CodeChef Brand |
| **Color Mode** | Dark only (enforced via `<html class="dark">`) |
| **Font Stack** | Space Grotesk (display) · Inter (body) · JetBrains Mono (telemetry) |

---

## 1. Design Philosophy

### The Problem with 95% of College Event Websites

```
┌─────────────────────────────────────────────────────────┐
│  White background (#ffffff)                             │
│  Bootstrap card with default shadows                    │
│  Blue primary button (#0d6efd)                          │
│  System font (Arial/Helvetica)                          │
│  No micro-interactions                                  │
│  "Looks like a tutorial project"                        │
└─────────────────────────────────────────────────────────┘
```

### The ChefOps v2.6 Approach

```
┌─────────────────────────────────────────────────────────┐
│  Deep obsidian canvas (#07090e)                         │
│  Glassmorphism cards with luminous amber borders        │
│  Kitchen flame gradient (amber → orange)                │
│  3-tier professional typography                         │
│  Holographic QR pass with conic-gradient animation      │
│  "Looks like a product built by a team at a startup"    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Color Token System

### 2.1 Foundation Palette

| Token Name | Hex | Tailwind Class | Role |
|:---|:---|:---|:---|
| `--surface-base` | `#07090e` | `bg-[#07090e]` | Page canvas, deepest background |
| `--surface-elevated` | `#0c1018` | `bg-[#0c1018]` | Cards, modals, dropdowns |
| `--surface-overlay` | `#111827` | `bg-gray-900` | Hover states, nested containers |
| `--border-subtle` | `#1e293b` | `border-slate-800` | Card borders, dividers |
| `--border-interactive` | `#f59e0b40` | `border-amber-500/25` | Focus rings, active states |
| `--text-primary` | `#f8fafc` | `text-slate-50` | Headings, primary content |
| `--text-secondary` | `#94a3b8` | `text-slate-400` | Descriptions, metadata |
| `--text-tertiary` | `#475569` | `text-slate-600` | Disabled states, timestamps |

### 2.2 Accent Palette — Kitchen Flame System

| Token | Hex | Tailwind | Usage |
|:---|:---|:---|:---|
| `--flame-primary` | `#f59e0b` | `text-amber-500` | Primary CTAs, active navigation, hero accents |
| `--flame-secondary` | `#ea580c` | `text-orange-600` | Gradient endpoints, hover states |
| `--flame-glow` | `#f59e0b36` | `shadow-amber-500/22` | Card glow shadows, spotlight effects |
| `--flame-surface` | `#f59e0b1a` | `bg-amber-500/10` | Badge backgrounds, pill fills |

### 2.3 Semantic Status Colors

| Status | Color | Hex | Usage |
|:---|:---|:---|:---|
| **Success / Verified** | Emerald | `#10b981` | Gate check-in confirmed, registration success |
| **Warning / Filling** | Amber | `#f59e0b` | Capacity 65-85%, pending states |
| **Critical / Full** | Rose | `#f43f5e` | Capacity >85%, errors, destructive actions |
| **Info / Ops** | Cyan | `#06b6d4` | Station badges, telemetry data, AI concierge |
| **Premium / CP** | Purple | `#a855f7` | Competitive programming badges, advanced tags |

### 2.4 Capacity Heatmap Color Scale

```
Occupancy:   0%         30%         65%         85%         100%
             │           │           │           │           │
Color:    emerald-500  emerald-400  amber-500  rose-500   rose-600
             │           │           │           │           │
Label:    "Open"      "Healthy"   "Filling    "Critical   "HOUSE
                                    Fast"       - Few       FULL"
                                                Left!"
```

---

## 3. Typography System

### 3.1 Font Stack Specification

| Tier | Font | Weight Range | `font-family` CSS | CDN |
|:---|:---|:---|:---|:---|
| **Display** | Space Grotesk | 500 (Medium), 600 (SemiBold), 700 (Bold) | `'Space Grotesk', sans-serif` | Google Fonts |
| **Body** | Inter | 400 (Regular), 500 (Medium), 600 (SemiBold) | `'Inter', -apple-system, sans-serif` | Google Fonts |
| **Telemetry** | JetBrains Mono | 400 (Regular), 500 (Medium) | `'JetBrains Mono', monospace` | Google Fonts |

### 3.2 Type Scale

| Element | Font | Size (Tailwind) | Weight | Line Height | Letter Spacing |
|:---|:---|:---|:---|:---|:---|
| **Page Hero Title** | Space Grotesk | `text-4xl` / `sm:text-5xl` | Bold (700) | `leading-tight` | `-0.02em` |
| **Section Heading** | Space Grotesk | `text-2xl` / `sm:text-3xl` | SemiBold (600) | `leading-snug` | default |
| **Card Title** | Space Grotesk | `text-lg` / `text-xl` | SemiBold (600) | `leading-snug` | default |
| **Body Text** | Inter | `text-sm` / `text-base` | Regular (400) | `leading-relaxed` | default |
| **Caption / Meta** | Inter | `text-xs` | Medium (500) | `leading-normal` | default |
| **Ticket ID** | JetBrains Mono | `text-xs` / `text-sm` | Medium (500) | `leading-none` | `tracking-wider` |
| **Terminal Snippet** | JetBrains Mono | `text-sm` | Regular (400) | `leading-relaxed` | `tracking-wide` |
| **KPI Counter** | Space Grotesk | `text-3xl` / `text-4xl` | Bold (700) | `leading-none` | `-0.02em` |
| **Label / Overline** | JetBrains Mono | `text-[11px]` | Medium (500) | `leading-normal` | `tracking-widest uppercase` |

---

## 4. Component Design Tokens

### 4.1 Card System

```
┌─────────────────────────────────────────────────┐
│  Standard Event Card                            │
│                                                 │
│  Background:  bg-[#0c1018]/80                   │
│  Border:      1px solid slate-800/60            │
│  Hover:       border-amber-500/40               │
│               shadow-[0_0_30px_rgba(245,158,     │
│               11,0.12)]                         │
│  Radius:      rounded-2xl (16px)                │
│  Padding:     p-5 sm:p-6                        │
│  Transition:  all 300ms ease                    │
│                                                 │
│  Internal spacing:                              │
│  ├── Category badge:    mb-3                    │
│  ├── Title:             mb-1                    │
│  ├── Meta (date/venue): mb-3                    │
│  ├── Description:       mb-4                    │
│  ├── Tags:              mb-4                    │
│  ├── Capacity bar:      mb-4                    │
│  └── CTAs:              mt-auto (flex-end)      │
└─────────────────────────────────────────────────┘
```

### 4.2 Button System

| Variant | Background | Text | Border | Hover | Use Case |
|:---|:---|:---|:---|:---|:---|
| **Primary (Flame)** | `gradient amber-500 → orange-600` | `slate-950` (dark) | none | `amber-400 → orange-500` + glow shadow | "Book Seat", "Register", "Submit" |
| **Secondary** | `slate-800` | `slate-200` | `border-slate-700` | `slate-700` + text-white | "Run-of-Show", "Print Pass", "Close" |
| **Ghost** | `transparent` | `slate-400` | none | `text-amber-300` | Navigation pills, sort options |
| **Danger** | `rose-500/20` | `rose-300` | `border-rose-500/30` | `rose-500` bg + dark text | "Delete Event", "Reset Data" |
| **Success** | `emerald-500/20` | `emerald-300` | `border-emerald-500/30` | `emerald-500` bg + dark text | "Mark Verified", "Confirm" |

### 4.3 Badge / Pill System

| Type | Example | Styling |
|:---|:---|:---|
| **Category** | `Hackathon`, `Workshop` | `px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25` |
| **Tag** | `24-Hr`, `Cash Prizes` | `px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700` |
| **Status** | `Checked-In ✅` | `px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40` |
| **Mentor Badge** | `6★ CodeChef`, `GSoC '26` | `px-2 py-0.5 rounded-md text-[11px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/25` |

---

## 5. Motion & Animation System

### 5.1 Transition Defaults

| Property | Duration | Easing | Tailwind |
|:---|:---|:---|:---|
| **Color / opacity** | 200ms | `ease` | `transition-colors duration-200` |
| **Transform / layout** | 300ms | `ease-out` | `transition-all duration-300` |
| **Modal entrance** | 300ms | `ease-out` | Custom `animate-fadeIn` |
| **Modal exit** | 200ms | `ease-in` | Opacity → 0 |

### 5.2 Signature Animations

| Animation | CSS | Duration | Usage |
|:---|:---|:---|:---|
| **Holographic Sheen** | `@keyframes spin-slow` — rotates `conic-gradient` pseudo-element 360° | 14s linear infinite | QR Chef Pass ticket background |
| **Countdown Pulse** | Scale 1 → 1.05 → 1 on second tick | 500ms per tick | Live countdown digits when < 24hrs |
| **Capacity Bar Fill** | Width transition from 0% → actual% | 800ms ease-out | On card mount / data change |
| **Scanner Success** | Border glow emerald + scale 1.02 | 600ms ease | Gate check-in confirmed |
| **Scanner Error** | Horizontal shake (translateX ±4px) | 400ms | Ticket not found |
| **Confetti Burst** | `canvas-confetti` particles | 2500ms | Registration success celebration |

### 5.3 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Responsive Layout Specification

### 6.1 Container Strategy

```css
/* Max-width container centered with responsive padding */
.container {
  max-width: 1280px;    /* xl breakpoint */
  margin: 0 auto;
  padding: 0 16px;      /* px-4 */
}

@media (min-width: 640px)  { .container { padding: 0 24px; } }  /* sm:px-6 */
@media (min-width: 1024px) { .container { padding: 0 32px; } }  /* lg:px-8 */
```

### 6.2 Event Grid Breakpoints

| Viewport | Columns | Card Behavior |
|:---|:---|:---|
| `< 640px` | 1 column | Full-width stacked cards |
| `640px – 767px` | 1 column | Wider cards with side-by-side meta |
| `768px – 1023px` | 2 columns | `grid-cols-2 gap-5` |
| `1024px+` | 3 columns | `grid-cols-3 gap-6` |

### 6.3 Navigation Breakpoints

| Viewport | Nav Behavior |
|:---|:---|
| `< 768px` | Horizontal scrollable pill bar. "My Passes" as icon-only. `Ctrl+K` badge hidden (still functional). |
| `768px+` | Full horizontal nav with text labels. `Ctrl+K` badge visible. |

### 6.4 Modal Breakpoints

| Viewport | Modal Behavior |
|:---|:---|
| `< 640px` | Full-screen overlay (`inset-0`), rounded-top only (`rounded-t-2xl`), bottom-anchored |
| `640px+` | Centered card (`max-w-lg` / `max-w-2xl`), full border radius, backdrop blur |

---

## 7. Glassmorphism Specification

### 7.1 Standard Glass Card

```css
.glass-card {
  background: rgba(12, 16, 24, 0.80);           /* --surface-elevated at 80% */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(30, 41, 59, 0.60);     /* --border-subtle at 60% */
  border-radius: 16px;
}

.glass-card:hover {
  border-color: rgba(245, 158, 11, 0.40);        /* --flame-primary at 40% */
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.12); /* amber glow */
}
```

### 7.2 Holographic Ticket (`holo-ticket`)

```css
.holo-ticket {
  background: linear-gradient(
    135deg,
    rgba(24, 28, 40, 0.95) 0%,
    rgba(15, 18, 28, 0.98) 50%,
    rgba(36, 23, 15, 0.95) 100%
  );
  border: 1px solid rgba(245, 158, 11, 0.40);
  box-shadow: 0 0 60px rgba(245, 158, 11, 0.22);
  position: relative;
  overflow: hidden;
}

.holo-ticket::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: conic-gradient(
    from 180deg at 50% 50%,
    transparent 0deg,
    rgba(245, 158, 11, 0.12) 60deg,
    rgba(6, 182, 212, 0.12) 120deg,
    transparent 180deg,
    rgba(249, 115, 22, 0.10) 240deg,
    transparent 360deg
  );
  animation: spin-slow 14s linear infinite;
  pointer-events: none;
}
```

---

## 8. Accessibility Compliance

### 8.1 Color Contrast Ratios (WCAG 2.1 AA)

| Foreground | Background | Contrast Ratio | Pass? |
|:---|:---|:---|:---|
| `slate-50` (#f8fafc) | `base` (#07090e) | **19.2:1** | ✅ AAA |
| `amber-400` (#fbbf24) | `base` (#07090e) | **11.8:1** | ✅ AAA |
| `slate-400` (#94a3b8) | `base` (#07090e) | **7.1:1** | ✅ AA |
| `slate-400` (#94a3b8) | `elevated` (#0c1018) | **6.4:1** | ✅ AA |
| `amber-300` (#fcd34d) | `elevated` (#0c1018) | **12.4:1** | ✅ AAA |
| `emerald-300` (#6ee7b7) | `elevated` (#0c1018) | **10.9:1** | ✅ AAA |

### 8.2 Keyboard Navigation

| Key | Global Action |
|:---|:---|
| `Ctrl + K` / `Cmd + K` | Toggle Command Palette |
| `Escape` | Close any open modal or palette |
| `Tab` | Focus traversal through interactive elements |
| `Enter` | Activate focused button / submit form |

### 8.3 Semantic HTML & ARIA

- All interactive elements use `<button>` (not `<div onClick>`)
- Form inputs have associated `<label>` elements or `aria-label`
- Modals use `role="dialog"` with `aria-modal="true"`
- Status badges include `aria-label` for screen readers (e.g., `aria-label="Registration status: Checked In"`)
- Focus trap inside open modals (Tab cycles within modal boundary)

---

## 9. Iconography

**Library:** `lucide-react` (tree-shakeable, ~400 bytes per icon)

| Icon | Lucide Name | Usage Context |
|:---|:---|:---|
| 🔍 | `Search` | Search input prefix |
| 📅 | `Calendar` | Event date display |
| ⏰ | `Clock` | Event time display |
| 📍 | `MapPin` | Venue location |
| 🎫 | `Ticket` | My Passes wallet |
| 🛡️ | `Shield` | Admin console |
| 📷 | `ScanLine` | QR gate scanner |
| ⬇️ | `Download` | CSV export |
| ⌨️ | `Terminal` | Command palette, CLI snippets |
| ✨ | `Sparkles` | AI concierge, featured badges |
| 🏆 | `Trophy` | Branch battle leaderboard |
| 🔥 | `Flame` | Kitchen/CodeChef accent |
| ✅ | `CheckCircle2` | Confirmation states |
| ❌ | `X` | Close / dismiss |
| 🖨️ | `Printer` | Print/save pass |
| 📋 | `Copy` | Copy ticket ID |

---

<p align="center"><code>ChefOps v2.6</code> · UI/UX Design System Document · CodeChef ABESEC 2026–27</p>
