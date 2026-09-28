import React, { useState, useEffect } from 'react';
import {
  Search,
  Terminal,
  Calendar,
  Shield,
  Sparkles,
  Download,
  ScanLine,
  ArrowRight,
  X,
  Flame,
  Trophy,
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  events,
  onNavigate,
  onSelectEvent,
  onOpenRegister,
  onExportCsv,
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate('__toggle_cmd__');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'act-explore',
      label: 'Explore All Kitchen Events & Filter',
      category: 'Navigation',
      icon: Calendar,
      action: () => {
        onNavigate('events');
        onClose();
      },
    },
    {
      id: 'act-ai',
      label: 'Ask Head Chef AI: Recommend Best Event For Me',
      category: 'AI Concierge',
      icon: Sparkles,
      action: () => {
        onNavigate('ai-finder');
        onClose();
      },
    },
    {
      id: 'act-leaderboard',
      label: 'Live ABESEC Branch Participation Battle (CSE vs AIML vs IT)',
      category: 'Live Ops',
      icon: Trophy,
      action: () => {
        onNavigate('leaderboard');
        onClose();
      },
    },
    {
      id: 'act-scanner',
      label: 'Open Admin QR Gate Check-In Scanner Simulator',
      category: 'Admin & Operations',
      icon: ScanLine,
      action: () => {
        onNavigate('admin-scanner');
        onClose();
      },
    },
    {
      id: 'act-admin',
      label: 'Open Admin Command Center (Add/Edit Events & View Students)',
      category: 'Admin & Operations',
      icon: Shield,
      action: () => {
        onNavigate('admin');
        onClose();
      },
    },
    {
      id: 'act-csv',
      label: 'Export All Student Registrations to CSV Spreadsheet',
      category: 'Admin & Operations',
      icon: Download,
      action: () => {
        onExportCsv();
        onClose();
      },
    },
  ];

  const filteredActions = quickActions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(query.toLowerCase()) ||
      ev.category.toLowerCase().includes(query.toLowerCase()) ||
      ev.venue.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0c1018] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Terminal className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search ABESEC events, venues, or jump to Admin QR Scanner..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono bg-slate-800 text-slate-400 rounded hover:text-white cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {filteredActions.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Quick Kitchen Commands
              </p>
              <div className="space-y-1">
                {filteredActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-500/10 text-left group transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/90 group-hover:bg-amber-500/20 text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                            {item.label}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Events in the Kitchen ({filteredEvents.length})
              </p>
              <div className="space-y-1">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/70 transition"
                  >
                    <button
                      onClick={() => {
                        onSelectEvent(ev);
                        onClose();
                      }}
                      className="flex-1 text-left flex items-center gap-3 cursor-pointer"
                    >
                      <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{ev.title}</p>
                        <p className="text-xs text-slate-400">
                          {ev.category} • {ev.date} • {ev.venue}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onOpenRegister(ev);
                        onClose();
                      }}
                      className="ml-3 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-semibold border border-amber-500/30 transition cursor-pointer"
                    >
                      Book Seat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredActions.length === 0 && filteredEvents.length === 0 && (
            <div className="py-10 text-center text-slate-400 text-sm">
              No matching commands or events found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>CodeChef ABESEC // Command Palette v2.6</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
