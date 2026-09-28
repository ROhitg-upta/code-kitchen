import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Link,
  AlertTriangle,
  Ticket,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegistrationModal({
  event,
  registrations,
  onClose,
  onRegister,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');
  const [handle, setHandle] = useState('');
  const [errors, setErrors] = useState({});
  const [duplicateTicket, setDuplicateTicket] = useState(null);

  // Live counts
  const liveCount = registrations.filter((r) => r.eventId === event.id).length;
  const remaining = Math.max(0, event.capacity - liveCount);
  const isFull = remaining <= 0;

  const remainingColor =
    remaining < 5
      ? 'text-rose-400'
      : remaining < 20
        ? 'text-amber-400'
        : 'text-emerald-400';

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters.';
    if (!email.trim() || !email.includes('@'))
      errs.email = 'Enter a valid email address.';
    if (!year) errs.year = 'Please select your year.';
    if (!branch) errs.branch = 'Please select your branch.';
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim()))
      errs.phone = 'Enter a valid 10-digit WhatsApp number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Duplicate check
    const existing = registrations.find(
      (r) =>
        r.email.toLowerCase() === email.trim().toLowerCase() &&
        r.eventId === event.id
    );
    if (existing) {
      setDuplicateTicket(existing);
      return;
    }

    // Capacity check
    if (isFull) return;

    // Generate ticket
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
      stationInterest: 'Development + Events',
      registeredAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      checkedIn: false,
    };

    onRegister(newReg);
  };

  const inputBase =
    'w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-fadeIn max-h-[90vh] overflow-y-auto relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" />
          Book Your Seat
        </h2>
        <p className="font-mono text-sm text-amber-400 mt-1 truncate pr-8">
          {event.title}
        </p>

        {/* Seat status */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
              isFull
                ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                : remainingColor === 'text-rose-400'
                  ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                  : remainingColor === 'text-amber-400'
                    ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                    : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
            )}
          >
            {isFull ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Full Capacity
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {remaining} seats remaining
              </>
            )}
          </span>
        </div>

        {/* Full capacity block */}
        {isFull && (
          <div className="mt-5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center">
            <p className="text-rose-300 font-semibold text-sm">
              This event is at full capacity. 😔
            </p>
            <p className="text-rose-400/70 text-xs mt-1">
              Check back later or explore other events.
            </p>
          </div>
        )}

        {/* Duplicate warning */}
        {duplicateTicket && (
          <div className="mt-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">
                  You're already registered!
                </p>
                <p className="text-amber-400/70 text-xs mt-1">
                  Your ticket:{' '}
                  <span className="font-mono font-semibold text-amber-300">
                    {duplicateTicket.ticketId}
                  </span>
                </p>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="cursor-pointer mt-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!isFull && !duplicateTicket && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={cn(inputBase, 'pl-10')}
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* College Email */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                College Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@abes.ac.in"
                  className={cn(inputBase, 'pl-10')}
                />
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                Use your @abes.ac.in email
              </p>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Year & Branch row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={cn(inputBase, 'cursor-pointer')}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year (2026-30)">1st Year (2026-30)</option>
                  <option value="2nd Year (2025-29)">2nd Year (2025-29)</option>
                  <option value="3rd Year (2024-28)">3rd Year (2024-28)</option>
                  <option value="4th Year (2023-27)">4th Year (2023-27)</option>
                </select>
                {errors.year && (
                  <p className="text-rose-400 text-xs mt-1">{errors.year}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Branch *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className={cn(inputBase, 'cursor-pointer')}
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
                  <p className="text-rose-400 text-xs mt-1">{errors.branch}</p>
                )}
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                WhatsApp Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="9876543210"
                  className={cn(inputBase, 'pl-10')}
                />
              </div>
              {errors.phone && (
                <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* GitHub/CodeChef Handle */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">
                GitHub / CodeChef Handle{' '}
                <span className="text-slate-600">(optional)</span>
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="github.com/your-handle"
                  className={cn(inputBase, 'pl-10')}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all duration-200 active:scale-[0.98] mt-2"
            >
              <Ticket className="w-4 h-4" />
              Confirm Registration & Get Chef Pass
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
