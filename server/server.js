import express from "express";
import cors from "cors";
import { store } from "./db/store.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Store
await store.init();

/* ───────── 1. Health & Telemetry ───────── */
app.get("/api/health", async (_req, res) => {
  const events = await store.getEvents();
  const registrations = await store.getRegistrations();
  res.json({
    success: true,
    status: "operational",
    engine: store.mode,
    version: "2.6.0",
    counts: {
      events: events.length,
      registrations: registrations.length,
      checkedIn: registrations.filter((r) => r.checkedIn).length,
    },
    timestamp: new Date().toISOString(),
  });
});

/* ───────── 2. Events Routes ───────── */
app.get("/api/events", async (_req, res) => {
  try {
    const events = await store.getEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const created = await store.createEvent(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const updated = await store.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await store.deleteEvent(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* ───────── 3. Registrations & Gate Check-In Routes ───────── */
app.get("/api/registrations", async (req, res) => {
  try {
    let list = await store.getRegistrations();
    const { eventId, branch, checkedIn } = req.query;
    if (eventId) list = list.filter((r) => r.eventId === eventId);
    if (branch) list = list.filter((r) => r.branch === branch);
    if (checkedIn !== undefined) {
      const flag = checkedIn === "true";
      list = list.filter((r) => Boolean(r.checkedIn) === flag);
    }
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/registrations", async (req, res) => {
  try {
    const created = await store.createRegistration(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === "DUPLICATE_REGISTRATION") {
      return res.status(409).json({
        success: false,
        code: "DUPLICATE_REGISTRATION",
        message: err.message,
        existingTicket: err.existingTicket,
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

app.patch("/api/registrations/:id/checkin", async (req, res) => {
  try {
    const updated = await store.toggleCheckIn(req.params.id);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Registration not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post("/api/registrations/scan", async (req, res) => {
  try {
    const raw = String(req.body.ticketId || "").trim();
    const normalized = /^\d{4}$/.test(raw)
      ? `CC-ABES-${raw}`
      : raw.toUpperCase();
    const list = await store.getRegistrations();
    const found = list.find((r) => r.ticketId === normalized);
    if (!found) {
      return res
        .status(404)
        .json({ success: false, status: "notfound", ticketId: normalized });
    }
    res.json({
      success: true,
      status: found.checkedIn ? "already" : "found",
      data: found,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* ───────── 4. Branch Battle Leaderboard Stats ───────── */
app.get("/api/stats/branches", async (_req, res) => {
  const list = await store.getRegistrations();
  const counts = list.reduce((acc, r) => {
    if (!r.branch) return acc;
    acc[r.branch] = (acc[r.branch] || 0) + 1;
    return acc;
  }, {});
  const leaderboard = Object.entries(counts)
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count);
  res.json({ success: true, data: leaderboard });
});

/* ───────── 5. Broadcast Ticker & Reset ───────── */
app.get("/api/broadcast", async (_req, res) => {
  const msg = await store.getBroadcast();
  res.json({ success: true, message: msg });
});

app.post("/api/broadcast", async (req, res) => {
  const msg = await store.setBroadcast(req.body.message || "");
  res.json({ success: true, message: msg });
});

app.post("/api/reset", async (_req, res) => {
  const state = await store.reset();
  res.json({ success: true, data: state });
});

app.post("/api/auth/login", (req, res) => {
  const { pin } = req.body;
  if (!pin || pin === "2026") {
    return res.json({
      success: true,
      token: "chefops-admin-jwt-2026",
      role: "chapter_lead",
    });
  }
  res.status(401).json({ success: false, error: "Invalid Admin PIN" });
});

app.listen(PORT, () => {
  console.log(
    `🔥 [ChefOps v2.6 Backend] Express REST API live at http://localhost:${PORT}/api/health`
  );
});
