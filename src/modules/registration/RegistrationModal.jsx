import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Link,
  AlertTriangle,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegistrationModal({
  event,
  registrations,
  onClose,
  onRegister,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [handle, setHandle] = useState("");
  const [errors, setErrors] = useState({});
  const [duplicateTicket, setDuplicateTicket] = useState(null);

  const liveCount = registrations.filter((r) => r.eventId === event.id).length;
  const remaining = Math.max(0, event.capacity - liveCount);
  const isFull = remaining <= 0;

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (!email.trim() || !email.includes("@"))
      errs.email = "Enter a valid college email address.";
    if (!year) errs.year = "Please select your academic year.";
    if (!branch) errs.branch = "Please select your branch.";
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim()))
      errs.phone = "Enter a valid 10-digit WhatsApp number.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const existing = registrations.find(
      (r) =>
        r.email.toLowerCase() === email.trim().toLowerCase() &&
        r.eventId === event.id
    );
    if (existing) {
      setDuplicateTicket(existing);
      return;
    }

    if (isFull) return;

    const ticketId = `CC-ABES-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;

    const newReg = {
      id: `reg-${Date.now()}`,
      ticketId,
      eventId: event.id,
      eventTitle: event.title,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      year,
      branch,
      phone: phone.trim(),
      handle: handle.trim(),
      stationInterest: "Development + Events",
      registeredAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      checkedIn: false,
    };

    onRegister(newReg);
  };

  const inputBase =
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white/60 focus:outline-none transition";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/25 shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-fadeIn max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          // OFFICIAL SEAT RESERVATION
        </span>
        <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2 mt-1">
          <Ticket className="w-5 h-5 text-white" />
          Book Holographic Pass
        </h2>
        <p className="font-mono text-xs text-zinc-300 mt-1 truncate pr-8">
          {event.title}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 text-white border border-white/20">
            {isFull ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                FULL CAPACITY
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {remaining} SEATS AVAILABLE
              </>
            )}
          </span>
        </div>

        {duplicateTicket && (
          <div className="mt-5 bg-zinc-900 border border-white/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">
                  Duplicate Registration Detected
                </p>
                <p className="text-zinc-400 text-xs mt-1">
                  Your issued ticket ID:{" "}
                  <span className="font-mono font-bold text-white">
                    {duplicateTicket.ticketId}
                  </span>
                </p>
                <button
                  onClick={onClose}
                  className="cursor-pointer mt-3 px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {!isFull && !duplicateTicket && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohit Gupta"
                  className={cn(inputBase, "pl-10")}
                />
              </div>
              {errors.name && (
                <p className="text-zinc-300 font-mono text-xs mt-1">
                  ! {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                College Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohit.25b0101@abes.ac.in"
                  className={cn(inputBase, "pl-10")}
                />
              </div>
              {errors.email && (
                <p className="text-zinc-300 font-mono text-xs mt-1">
                  ! {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={cn(inputBase, "cursor-pointer")}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year (2026-30)">1st Year (2026-30)</option>
                  <option value="2nd Year (2025-29)">2nd Year (2025-29)</option>
                  <option value="3rd Year (2024-28)">3rd Year (2024-28)</option>
                  <option value="4th Year (2023-27)">4th Year (2023-27)</option>
                </select>
                {errors.year && (
                  <p className="text-zinc-300 font-mono text-xs mt-1">
                    ! {errors.year}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Branch *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className={cn(inputBase, "cursor-pointer")}
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="CSE-AIML">CSE-AIML</option>
                  <option value="CSE-DS">CSE-DS</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="Other">Other</option>
                </select>
                {errors.branch && (
                  <p className="text-zinc-300 font-mono text-xs mt-1">
                    ! {errors.branch}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                WhatsApp Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  className={cn(inputBase, "pl-10")}
                />
              </div>
              {errors.phone && (
                <p className="text-zinc-300 font-mono text-xs mt-1">
                  ! {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">
                GitHub / CodeChef Handle{" "}
                <span className="text-zinc-600">(Optional)</span>
              </label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="github.com/ROhitg-upta"
                  className={cn(inputBase, "pl-10")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all active:scale-[0.98] mt-2"
            >
              <Ticket className="w-4 h-4" />
              Generate Holographic QR Chef Pass
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
