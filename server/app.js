import express from "express";
import cors from "cors";
import crypto from "crypto";
import { store } from "./db/store.js";

const app = express();
const SECRET_KEY = process.env.CHEFOPS_SECRET || "codechef-abesec-chefops-v2.6-secret";

app.use(cors());
app.use(express.json());

// Ensure store is initialized once
let initialized = false;
async function ensureStore() {
  if (!initialized) {
    await store.init();
    initialized = true;
  }
}

// In-memory operational audit log ring buffer (last 50 ops)
const auditLogs = [
  {
    id: "aud-1",
    action: "SYSTEM_BOOT",
    actor: "chefops-kernel",
    detail: "Dual-Engine API + HMAC-SHA256 Ticket Signer Online",
    timestamp: new Date().toLocaleTimeString("en-IN"),
  },
  {
    id: "aud-2",
    action: "GATE_SCAN_VERIFIED",
    actor: "gate-scanner-01",
    detail: "Verified pass CC-ABES-9041 (Aarav Verma · CSE)",
    timestamp: new Date().toLocaleTimeString("en-IN"),
  },
];

function logAudit(action, actor, detail) {
  auditLogs.unshift({
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    action,
    actor,
    detail,
    timestamp: new Date().toLocaleTimeString("en-IN"),
  });
  if (auditLogs.length > 50) auditLogs.pop();
}

export function signTicket(ticketId, email = "") {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${ticketId}:${email.toLowerCase()}`)
    .digest("hex")
    .slice(0, 16)
    .toUpperCase();
}

/* ───────── 1. Health & Telemetry ───────── */
app.get("/api/health", async (_req, res) => {
  await ensureStore();
  const events = await store.getEvents();
  const registrations = await store.getRegistrations();
  res.json({
    success: true,
    status: "operational",
    engine: store.mode,
    deployment: process.env.VERCEL ? "vercel-serverless-edge" : "node-express-server",
    security: "HMAC-SHA256-SIGNED",
    version: "2.6.0",
    counts: {
      events: events.length,
      registrations: registrations.length,
      checkedIn: registrations.filter((r) => r.checkedIn).length,
      auditEvents: auditLogs.length,
    },
    timestamp: new Date().toISOString(),
  });
});

/* ───────── 2. Audit Logs Endpoint ───────── */
app.get("/api/audit", async (_req, res) => {
  res.json({ success: true, data: auditLogs });
});

/* ───────── 3. Events CRUD & Search by Name ───────── */
app.get("/api/events", async (req, res) => {
  try {
    await ensureStore();
    let events = await store.getEvents();
    const { search, category } = req.query;
    if (category && category !== "All") {
      events = events.filter((e) => e.category === category);
    }
    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      events = events.filter((e) =>
        [e.title, e.subtitle, e.category, e.venue, ...(e.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    await ensureStore();
    const created = await store.createEvent(req.body);
    logAudit("EVENT_CREATED", "admin-console", `Created event: ${created.title}`);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    await ensureStore();
    const updated = await store.updateEvent(req.params.id, req.body);
    logAudit("EVENT_UPDATED", "admin-console", `Updated event ID: ${req.params.id}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await ensureStore();
    await store.deleteEvent(req.params.id);
    logAudit("EVENT_DELETED", "admin-console", `Deleted event ID: ${req.params.id}`);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* ───────── 4. Registrations & Cryptographic Ticket Issuance ───────── */
app.get("/api/registrations", async (req, res) => {
  try {
    await ensureStore();
    let list = await store.getRegistrations();
    const { eventId, branch, checkedIn } = req.query;
    if (eventId) list = list.filter((r) => r.eventId === eventId);
    if (branch) list = list.filter((r) => r.branch === branch);
    if (checkedIn !== undefined) {
      const flag = checkedIn === "true";
      list = list.filter((r) => Boolean(r.checkedIn) === flag);
    }
    res.json({
      success: true,
      data: list.map((r) => ({
        ...r,
        signature: r.signature || signTicket(r.ticketId, r.email),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/registrations", async (req, res) => {
  try {
    await ensureStore();
    const payload = {
      ...req.body,
      signature: signTicket(req.body.ticketId || "CC-ABES", req.body.email || ""),
    };
    const created = await store.createRegistration(payload);
    logAudit(
      "PASS_ISSUED",
      created.email,
      `Issued signed pass ${created.ticketId} [SIG:${payload.signature.slice(0, 8)}]`
    );
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
    await ensureStore();
    const updated = await store.toggleCheckIn(req.params.id);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Registration not found" });
    }
    logAudit(
      updated.checkedIn ? "GATE_CHECKIN_VERIFIED" : "GATE_CHECKIN_REVERTED",
      "gate-scanner",
      `${updated.ticketId} (${updated.name}) -> ${updated.checkedIn ? "VERIFIED" : "PENDING"}`
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post("/api/registrations/scan", async (req, res) => {
  try {
    await ensureStore();
    const raw = String(req.body.ticketId || "").trim();
    const normalized = /^\d{4}$/.test(raw)
      ? `CC-ABES-${raw}`
      : raw.toUpperCase();
    const list = await store.getRegistrations();
    const found = list.find((r) => r.ticketId === normalized);
    if (!found) {
      logAudit("GATE_SCAN_FAILED", "gate-scanner", `Invalid pass attempt: ${normalized}`);
      return res
        .status(404)
        .json({ success: false, status: "notfound", ticketId: normalized });
    }
    res.json({
      success: true,
      status: found.checkedIn ? "already" : "found",
      data: {
        ...found,
        signature: signTicket(found.ticketId, found.email),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* ───────── 5. Certificate Verification Endpoint ───────── */
app.get("/api/certificate/:ticketId", async (req, res) => {
  await ensureStore();
  const list = await store.getRegistrations();
  const found = list.find(
    (r) => r.ticketId.toUpperCase() === req.params.ticketId.toUpperCase()
  );
  if (!found) {
    return res.status(404).json({ success: false, error: "Certificate not found" });
  }
  const sig = signTicket(found.ticketId, found.email);
  res.json({
    success: true,
    certificate: {
      certificateId: `CERT-${found.ticketId}-${sig.slice(0, 6)}`,
      recipient: found.name,
      branch: found.branch,
      year: found.year,
      eventTitle: found.eventTitle,
      issuedBy: "CodeChef ABESEC Chapter (2026–27)",
      signatureHash: `0x${sig}`,
      verified: true,
    },
  });
});

/* ───────── 6. Branch Battle & Broadcast ───────── */
app.get("/api/stats/branches", async (_req, res) => {
  await ensureStore();
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

app.get("/api/broadcast", async (_req, res) => {
  await ensureStore();
  const msg = await store.getBroadcast();
  res.json({ success: true, message: msg });
});

app.post("/api/broadcast", async (req, res) => {
  await ensureStore();
  const msg = await store.setBroadcast(req.body.message || "");
  logAudit("BROADCAST_UPDATED", "admin-console", `Ticker: "${msg.slice(0, 48)}"`);
  res.json({ success: true, message: msg });
});

app.post("/api/reset", async (_req, res) => {
  await ensureStore();
  const state = await store.reset();
  logAudit("DB_RESET", "admin-console", "Restored initial ABESEC seed dataset");
  res.json({ success: true, data: state });
});

export default app;
