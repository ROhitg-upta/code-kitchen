import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from "../../src/data/initialData.js";
import { EventModel } from "../models/Event.js";
import { RegistrationModel } from "../models/Registration.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "../data/chefops-db.json");

/**
 * Dual-Engine Persistence Store
 * 1. Connects to MongoDB Atlas if MONGODB_URI is set in environment
 * 2. Otherwise persists all mutations to disk at server/data/chefops-db.json
 */
class ChefOpsStore {
  constructor() {
    this.mode = "disk-json-db";
    this.state = {
      events: [...INITIAL_EVENTS],
      registrations: [...INITIAL_REGISTRATIONS],
      broadcastMsg:
        "CODECHEF ABESEC COOK-OFF 7.0 REGISTRATIONS CLOSING SOON — BOOK YOUR VERIFIED HOLOGRAPHIC QR CHEF PASS NOW",
    };
  }

  async init() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
        this.mode = "mongodb-atlas";
        const count = await EventModel.countDocuments();
        if (count === 0) {
          await EventModel.insertMany(INITIAL_EVENTS);
          await RegistrationModel.insertMany(INITIAL_REGISTRATIONS);
        }
        console.log("✓ [ChefOps DB] Connected to MongoDB Atlas");
        return;
      } catch (err) {
        console.warn(
          "! [ChefOps DB] MongoDB connection failed, falling back to persistent disk JSON DB:",
          err.message
        );
      }
    }

    // Persistent Disk JSON Database
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.events && parsed.registrations) {
          this.state = parsed;
        }
      } catch {
        this.saveToDisk();
      }
    } else {
      this.saveToDisk();
    }
    console.log(`✓ [ChefOps DB] Initialized persistent store (${this.mode}) at ${DB_FILE}`);
  }

  saveToDisk() {
    if (this.mode !== "disk-json-db") return;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write DB file:", err.message);
    }
  }

  async getEvents() {
    if (this.mode === "mongodb-atlas") {
      return EventModel.find().lean();
    }
    return this.state.events;
  }

  async createEvent(eventData) {
    const newEvent = {
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`,
      registeredCount: Number(eventData.registeredCount) || 0,
      capacity: Number(eventData.capacity) || 100,
    };
    if (this.mode === "mongodb-atlas") {
      const doc = await EventModel.create(newEvent);
      return doc.toObject();
    }
    this.state.events.push(newEvent);
    this.saveToDisk();
    return newEvent;
  }

  async updateEvent(id, updates) {
    if (this.mode === "mongodb-atlas") {
      return EventModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
    }
    this.state.events = this.state.events.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.saveToDisk();
    return this.state.events.find((e) => e.id === id);
  }

  async deleteEvent(id) {
    if (this.mode === "mongodb-atlas") {
      await EventModel.deleteOne({ id });
      await RegistrationModel.deleteMany({ eventId: id });
      return { deleted: true };
    }
    this.state.events = this.state.events.filter((e) => e.id !== id);
    this.state.registrations = this.state.registrations.filter(
      (r) => r.eventId !== id
    );
    this.saveToDisk();
    return { deleted: true };
  }

  async getRegistrations() {
    if (this.mode === "mongodb-atlas") {
      return RegistrationModel.find().sort({ createdAt: -1 }).lean();
    }
    return this.state.registrations;
  }

  async createRegistration(regData) {
    if (this.mode === "mongodb-atlas") {
      const existing = await RegistrationModel.findOne({
        email: regData.email.toLowerCase(),
        eventId: regData.eventId,
      }).lean();
      if (existing) {
        const err = new Error("Already registered for this event");
        err.code = "DUPLICATE_REGISTRATION";
        err.existingTicket = existing;
        throw err;
      }
      const doc = await RegistrationModel.create(regData);
      await EventModel.updateOne(
        { id: regData.eventId },
        { $inc: { registeredCount: 1 } }
      );
      return doc.toObject();
    }

    const duplicate = this.state.registrations.find(
      (r) =>
        r.email.toLowerCase() === regData.email.toLowerCase() &&
        r.eventId === regData.eventId
    );
    if (duplicate) {
      const err = new Error("Already registered for this event");
      err.code = "DUPLICATE_REGISTRATION";
      err.existingTicket = duplicate;
      throw err;
    }

    this.state.registrations.unshift(regData);
    this.state.events = this.state.events.map((e) =>
      e.id === regData.eventId
        ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
        : e
    );
    this.saveToDisk();
    return regData;
  }

  async toggleCheckIn(regId) {
    if (this.mode === "mongodb-atlas") {
      const reg = await RegistrationModel.findOne({ id: regId });
      if (!reg) return null;
      reg.checkedIn = !reg.checkedIn;
      reg.checkedInAt = reg.checkedIn ? new Date() : null;
      await reg.save();
      return reg.toObject();
    }

    let updated = null;
    this.state.registrations = this.state.registrations.map((r) => {
      if (r.id === regId) {
        updated = {
          ...r,
          checkedIn: !r.checkedIn,
          checkedInAt: !r.checkedIn ? new Date().toISOString() : null,
        };
        return updated;
      }
      return r;
    });
    this.saveToDisk();
    return updated;
  }

  async getBroadcast() {
    return this.state.broadcastMsg;
  }

  async setBroadcast(message) {
    this.state.broadcastMsg = message || "";
    this.saveToDisk();
    return this.state.broadcastMsg;
  }

  async reset() {
    this.state.events = [...INITIAL_EVENTS];
    this.state.registrations = [...INITIAL_REGISTRATIONS];
    this.state.broadcastMsg =
      "CODECHEF ABESEC COOK-OFF 7.0 REGISTRATIONS CLOSING SOON — BOOK YOUR VERIFIED HOLOGRAPHIC QR CHEF PASS NOW";
    if (this.mode === "mongodb-atlas") {
      await EventModel.deleteMany({});
      await RegistrationModel.deleteMany({});
      await EventModel.insertMany(INITIAL_EVENTS);
      await RegistrationModel.insertMany(INITIAL_REGISTRATIONS);
    } else {
      this.saveToDisk();
    }
    return this.state;
  }
}

export const store = new ChefOpsStore();
