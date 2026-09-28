import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    ticketId: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    phone: { type: String, required: true },
    handle: { type: String, default: "" },
    stationInterest: { type: String, default: "Development + Events" },
    registeredAt: { type: String, required: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

RegistrationSchema.index({ email: 1, eventId: 1 }, { unique: true });

export const RegistrationModel =
  mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);
