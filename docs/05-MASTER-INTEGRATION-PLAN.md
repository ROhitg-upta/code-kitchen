# 🧠 05. Master Integration Plan & Backend Architecture
### Saved Design References, Component Mapping & Full-Stack Blueprint

| Meta | Detail |
|:---|:---|
| **Status** | `PLANNING ONLY` — No code written yet. Build when ready. |
| **Author** | Rohit Sharma |
| **Last Updated** | 28 September 2026 |

---

## Part A: Saved 21st.dev Design Components (Use When Building)

### 🎭 Component 1: `Skiper39` — CrowdCanvas (Animated Walking Crowd)

**Source:** 21st.dev (`skiper39.tsx`)  
**Dependencies:** `gsap` (GreenSock Animation Platform)  
**What it does:** Renders an HTML `<canvas>` filled with animated illustrated people (from OpenPeeps sprite sheet) walking across the screen in random directions at random speeds. Resizes responsively. Pure canvas rendering via GSAP ticker.

**Where to use in ChefOps v2.6:**

| Placement Option | Module | How It Fits |
|:---|:---|:---|
| **🔥 Option A (Recommended): Home Hero Background** | Module 1 — HomeModule | Behind the terminal hero badge and countdown timer. The animated crowd of "chefs" walking across the bottom of the hero section creates an instant "wow" factor. Represents the ABESEC community — students walking into the Code Kitchen. |
| **Option B: Events Page Empty State** | Module 2 — EventsExplorer | When search/filter returns 0 results, show the crowd walking with text: *"No events match your search. The kitchen is still cooking..."* |
| **Option C: Registration Success Celebration** | Module 3 — QR Pass | After QR Pass generates, show a mini crowd walking behind the holographic ticket as a celebration layer (combined with confetti). |

**Integration Notes (for build time):**
- Install `gsap` via npm
- The sprite sheet URL is baked into the component: `https://cdn.21st.dev/assets/localized/abdb8990...png` (15 rows × 7 cols of OpenPeeps illustrations)
- Canvas is `absolute bottom-0 h-[90vh] w-full` — overlay our hero content on top with `z-10`
- Must cleanup GSAP ticker and resize listener on unmount (already handled in the component)
- Consider reducing `h-[90vh]` to `h-[50vh]` or `h-[60vh]` so the crowd sits at the bottom half only, leaving the top clean for hero text + countdown
- **Performance:** Canvas rendering is lightweight. GSAP ticker runs at 60fps but only draws ~100 sprites. No performance concern.

---

### 📊 Component 2: `AgentTrace` — Agent Run Timeline with Playback

**Source:** 21st.dev (`agent-trace.tsx`)  
**Dependencies:** `lucide-react`, `motion` (framer-motion successor), `cn` utility from `@/lib/utils`  
**What it does:** Renders an interactive timeline of "spans" (like agent tasks) on a time axis. Features: play/pause replay, scrub/seek via drag, nested spans with indentation, color-coded status bars, token counters, keyboard navigation (`Ctrl+K` already in our project), CSV-like data display.

**Where to use in ChefOps v2.6:**

| Placement Option | Module | How It Fits |
|:---|:---|:---|
| **🔥 Option A (Recommended): Run-of-Show Live Timeline in Event Detail Modal** | Module 2 — EventsExplorer (Run-of-Show Modal) | Instead of a static list of timestamps, render the event's hour-by-hour agenda as an **interactive AgentTrace-style timeline**. Each agenda stage becomes a "span". The playhead scrubs through the event day. This transforms a basic schedule into a premium ops visualization. |
| **Option B: Admin Ops Activity Log** | Module 4 — AdminOpsModule | Show admin actions (event created, student checked-in, broadcast pushed) as trace spans on a timeline. Makes the Admin Console feel like a real ops dashboard. |
| **Option C: "Kitchen Activity" Live Feed on Home** | Module 1 — HomeModule | A compact trace showing recent platform activity: "Rohit registered for Cook-Off 7.0 → Kriti booked Ship It Fast → Admin pushed broadcast". |

**Adaptation Notes (for build time):**
- Remap `SpanKind` to our domain: `agent` → "Stage Owner", `model` → "Milestone", `tool` → "Logistics", `io` → "Check-In"
- Remap span data from our `event.agenda[]` array:
  ```
  agenda item { time: "09:00 AM", stage: "Gate Check-In", owner: "Events & Ops" }
       ↓ maps to ↓
  TraceSpan { id: "stage-1", label: "Gate Check-In", kind: "tool", start: 0, end: 5400000, detail: "Events & Ops" }
  ```
- The component uses shadcn/ui CSS variables (`--primary`, `--destructive`, `--muted-foreground`, etc.) — we'll need to define these in our Tailwind config or map to our amber/emerald/rose palette
- `motion` (framer-motion) is used only in the demo wrapper for entrance animations — the core `AgentTrace` component itself doesn't need it. We can skip `motion` and use our own CSS animations.
- The `cn()` utility needs `clsx` + `tailwind-merge` — add to deps.

---

## Part B: Full-Stack Backend & Database Architecture

### Why Backend?

The current plan uses `localStorage` for persistence. This is perfect for the recruitment submission because:
- Zero setup friction for evaluators
- Works offline
- No cold starts

**However**, to demonstrate **industry-level engineering** and make the project genuinely usable by CodeChef ABESEC, we should also build a real backend that can be optionally enabled.

### B.1: Recommended Backend Stack

| Layer | Technology | Why |
|:---|:---|:---|
| **Runtime** | Node.js + Express.js | Universal JS — same language as frontend. Seniors can read it. |
| **Database** | MongoDB Atlas (Free Tier) | Document-based = natural fit for event objects with nested agendas. Free 512MB cluster. |
| **ODM** | Mongoose | Schema validation, middleware hooks, clean query API. |
| **Auth** | JWT (JSON Web Tokens) | Stateless admin auth. No session store needed. |
| **File Storage** | Cloudinary (Free Tier) | If we add event poster images later. |
| **Deployment** | Render.com (Free Tier) or Railway | Auto-deploy from GitHub. Free tier sufficient. |

### B.2: Database Schema Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Collections                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 events                                                      │
│  ├── _id: ObjectId                                              │
│  ├── title: String (required)                                   │
│  ├── subtitle: String                                           │
│  ├── category: Enum ["Hackathon","CP","Development",            │
│  │                    "Workshop","Tech Talk"]                    │
│  ├── date: Date (required)                                      │
│  ├── time: String ("09:00 AM – 05:00 PM")                      │
│  ├── venue: String (required)                                   │
│  ├── description: String                                        │
│  ├── capacity: Number (required, min: 1)                        │
│  ├── registeredCount: Number (default: 0, virtual/computed)     │
│  ├── prizePool: String                                          │
│  ├── featured: Boolean (default: false)                         │
│  ├── difficulty: String                                         │
│  ├── teamSize: String                                           │
│  ├── tags: [String]                                             │
│  ├── prerequisites: String                                      │
│  ├── mentors: [{                                                │
│  │     name: String,                                            │
│  │     role: String,                                            │
│  │     badge: String                                            │
│  │   }]                                                         │
│  ├── agenda: [{                                                 │
│  │     time: String,                                            │
│  │     stage: String,                                           │
│  │     owner: String                                            │
│  │   }]                                                         │
│  ├── createdAt: Date (auto)                                     │
│  └── updatedAt: Date (auto)                                     │
│                                                                 │
│  🎫 registrations                                               │
│  ├── _id: ObjectId                                              │
│  ├── ticketId: String (unique, format: "CC-ABES-XXXX")         │
│  ├── eventId: ObjectId (ref: events, required)                  │
│  ├── name: String (required)                                    │
│  ├── email: String (required, lowercase, trim)                  │
│  ├── year: String (required)                                    │
│  ├── branch: Enum ["CSE","CSE-AIML","CSE-DS","IT",             │
│  │                  "ECE","ME","Other"]                          │
│  ├── phone: String (required, 10 digits)                        │
│  ├── handle: String (GitHub/CodeChef URL)                       │
│  ├── stationInterest: String                                    │
│  ├── checkedIn: Boolean (default: false)                        │
│  ├── checkedInAt: Date (null until scanned)                     │
│  ├── registeredAt: Date (auto)                                  │
│  └── Compound Index: { email + eventId } (unique)              │
│                                                                 │
│  🔐 admins                                                      │
│  ├── _id: ObjectId                                              │
│  ├── username: String (unique)                                  │
│  ├── passwordHash: String (bcrypt)                              │
│  ├── role: Enum ["super_admin", "chapter_lead", "ops_volunteer"]│
│  ├── station: String                                            │
│  └── createdAt: Date                                            │
│                                                                 │
│  📡 broadcasts                                                  │
│  ├── _id: ObjectId                                              │
│  ├── message: String (required)                                 │
│  ├── priority: Enum ["info", "urgent", "emergency"]             │
│  ├── pushedBy: ObjectId (ref: admins)                           │
│  ├── active: Boolean (default: true)                            │
│  ├── createdAt: Date                                            │
│  └── expiresAt: Date                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### B.3: REST API Endpoints

```
┌──────────────────────────────────────────────────────────────────┐
│                      API Route Map                               │
├──────────┬──────────────────────────┬────────────────────────────┤
│  Method  │  Endpoint                │  Description               │
├──────────┼──────────────────────────┼────────────────────────────┤
│          │  PUBLIC (No Auth)        │                            │
│  GET     │  /api/events             │  List all events           │
│  GET     │  /api/events/:id         │  Get event + agenda        │
│  GET     │  /api/events/featured    │  Get featured event        │
│  POST    │  /api/registrations      │  Register for event        │
│  GET     │  /api/registrations/:tid │  Get pass by ticket ID     │
│  GET     │  /api/broadcasts/active  │  Get current broadcast     │
│  GET     │  /api/stats/branches     │  Branch battle leaderboard │
│          │                          │                            │
│          │  ADMIN (JWT Required)    │                            │
│  POST    │  /api/auth/login         │  Admin login → JWT         │
│  POST    │  /api/events             │  Create event              │
│  PUT     │  /api/events/:id         │  Update event              │
│  DELETE  │  /api/events/:id         │  Delete event              │
│  GET     │  /api/admin/registrations│  List all registrations    │
│  PATCH   │  /api/admin/checkin/:tid │  Toggle check-in status    │
│  GET     │  /api/admin/export/csv   │  Export filtered CSV       │
│  POST    │  /api/admin/broadcasts   │  Push new broadcast        │
│  DELETE  │  /api/admin/broadcasts/:id│ Deactivate broadcast      │
└──────────┴──────────────────────────┴────────────────────────────┘
```

### B.4: API Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_REGISTRATION",
    "message": "You are already registered for this event.",
    "existingTicketId": "CC-ABES-9041"
  }
}
```

### B.5: Backend Directory Structure

```
server/
├── config/
│   ├── db.js                    # MongoDB Atlas connection
│   └── env.js                   # Environment variable validation
├── models/
│   ├── Event.js                 # Mongoose Event schema
│   ├── Registration.js          # Mongoose Registration schema
│   ├── Admin.js                 # Mongoose Admin schema
│   └── Broadcast.js             # Mongoose Broadcast schema
├── routes/
│   ├── events.js                # Public event routes
│   ├── registrations.js         # Registration + ticket routes
│   ├── admin.js                 # Protected admin CRUD routes
│   ├── auth.js                  # Login/JWT routes
│   └── broadcasts.js            # Broadcast ticker routes
├── middleware/
│   ├── auth.js                  # JWT verification middleware
│   ├── validate.js              # Request body validation
│   └── errorHandler.js          # Global error handler
├── utils/
│   ├── ticketGenerator.js       # CC-ABES-XXXX unique ID generator
│   ├── csvExporter.js           # JSON → CSV stream
│   └── seedData.js              # Initial ABESEC dataset seeder
├── server.js                    # Express app entry point
├── package.json
└── .env.example                 # Environment template
```

### B.6: Dual-Mode Architecture (LocalStorage + API)

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend (React SPA)                       │
│                                                              │
│  App.jsx → useDataStore() hook                               │
│     │                                                        │
│     ├── MODE: "local" (default for recruitment demo)         │
│     │   └── Read/Write localStorage                          │
│     │   └── Zero network calls                               │
│     │   └── Pre-seeded with initialData.js                   │
│     │                                                        │
│     └── MODE: "api" (when VITE_API_URL is set)               │
│         └── Fetch from Express backend                       │
│         └── JWT auth for admin routes                        │
│         └── Real-time broadcast polling (or WebSocket)       │
│                                                              │
│  Toggle via: VITE_DATA_MODE=local|api in .env                │
└──────────────────────────────────────────────────────────────┘
```

This means:
1. **Recruitment evaluators** get instant `localStorage` mode — zero setup, no backend needed
2. **If ABESEC actually deploys it**, flip to `api` mode with MongoDB Atlas backend

---

## Part C: Complete Technology Stack Summary

| Layer | Tech | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend Framework** | React | 19.x | UI rendering |
| **Build Tool** | Vite | 6.x | Dev server + production bundling |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS |
| **Typography** | Space Grotesk + Inter + JetBrains Mono | — | 3-tier type system |
| **Icons** | lucide-react | Latest | Tree-shakeable icon library |
| **Animations** | GSAP | Latest | CrowdCanvas sprite animation |
| **Celebrations** | canvas-confetti | ^1.9 | Registration success burst |
| **Motion** | CSS transitions + GSAP | — | No framer-motion dependency in core |
| **QR Generation** | Custom SVG (FNV-1a) | Hand-rolled | Zero-dep deterministic QR |
| **State (Local)** | React useState + localStorage | Built-in | Default persistence |
| **Backend Runtime** | Node.js + Express | 18.x / 4.x | REST API server |
| **Database** | MongoDB Atlas | Free Tier | Document store |
| **ODM** | Mongoose | 8.x | Schema + validation |
| **Auth** | JWT + bcrypt | — | Stateless admin auth |
| **Frontend Deploy** | Vercel | — | Static SPA hosting |
| **Backend Deploy** | Render.com | Free Tier | Express API hosting |

---

## Part D: Build Order (When We Start Coding)

```
Phase 1: Core Frontend (localStorage mode)
  ├── Step 1: Module 1 — HomeModule (Hero + Countdown + CrowdCanvas background)
  ├── Step 2: Module 2 — EventsExplorer (Search/Filter/Sort + Run-of-Show Modal)
  ├── Step 3: Module 3 — Registration + QR Chef Pass
  ├── Step 4: Module 4 — Admin CRUD + Scanner + CSV + Broadcast
  ├── Step 5: Module 5 — AI Chef Concierge
  ├── Step 6: Module 6 — Branch Battle Leaderboard
  ├── Step 7: Module 7 — Ctrl+K Command Palette
  └── Step 8: App.jsx (Root orchestrator + state + nav + ticker)

Phase 2: Polish & Integration
  ├── Step 9: Integrate CrowdCanvas (Skiper39) into Home Hero
  ├── Step 10: Integrate AgentTrace-style timeline into Run-of-Show Modal
  ├── Step 11: Full responsive testing (mobile → desktop)
  └── Step 12: Lighthouse audit + accessibility pass

Phase 3: Backend (Optional — if time permits before Sep 30 deadline)
  ├── Step 13: Express server + MongoDB connection
  ├── Step 14: Event + Registration + Admin models
  ├── Step 15: REST API routes
  ├── Step 16: JWT auth middleware
  ├── Step 17: useDataStore() hook with local/api toggle
  └── Step 18: Deploy backend to Render + frontend to Vercel

Phase 4: Final Submission
  ├── Step 19: Push to GitHub (public repo)
  ├── Step 20: Deploy live URL
  └── Step 21: Fill recruitment form with GitHub + Vercel links
```

---

<p align="center"><code>ChefOps v2.6</code> · Master Integration & Backend Plan · CodeChef ABESEC 2026–27</p>
