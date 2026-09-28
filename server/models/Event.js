import mongoose from "mongoose";

const AgendaItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    stage: { type: String, required: true },
    owner: { type: String, default: "Events & Ops" },
  },
  { _id: false }
);

const MentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "Mentor" },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Hackathon",
        "Competitive Programming",
        "Development",
        "Workshop",
        "Tech Talk",
      ],
      default: "Hackathon",
    },
    date: { type: String, required: true },
    time: { type: String, default: "09:00 AM – 05:00 PM" },
    venue: { type: String, required: true },
    description: { type: String, default: "" },
    capacity: { type: Number, required: true, min: 1, default: 100 },
    registeredCount: { type: Number, default: 0 },
    prizePool: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    difficulty: { type: String, default: "All Levels" },
    teamSize: { type: String, default: "Individual" },
    tags: [{ type: String }],
    prerequisites: { type: String, default: "" },
    mentors: [MentorSchema],
    agenda: [AgendaItemSchema],
  },
  { timestamps: true }
);

export const EventModel =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
