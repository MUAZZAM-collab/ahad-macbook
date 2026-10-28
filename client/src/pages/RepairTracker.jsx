import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  ShieldCheck,
  Laptop,
  User,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const STAGE_STEPS = [
  { index: 0, label: '1. Received & Diagnosed', short: 'Diagnosed' },
  { index: 1, label: '2. Quote Sent', short: 'Quote Sent' },
  { index: 2, label: '3. Repair in Progress', short: 'In Progress' },
  { index: 3, label: '4. Quality Testing', short: 'Testing' },
  { index: 4, label: '5. Ready for Pickup/Shipped', short: 'Ready' },
];

const RepairTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketIdInput, setTicketIdInput] = useState(searchParams.get('id') || 'AMB-9482');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFoundError, setNotFoundError] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const idFromParam = searchParams.get('id');
    if (idFromParam) {
      setTicketIdInput(idFromParam);
      fetchTicket(idFromParam);
    } else {
      // Default to demo ticket AMB-9482 for instant demonstration
      fetchTicket('AMB-9482');
    }
  }, [searchParams]);

  const fetchTicket = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setNotFoundError('');
    try {
      const res = await api.get(`/repairs/track/${encodeURIComponent(idToSearch.trim())}`);
      setTicket(res.data.data);
    } catch (err) {
      setTicket(null);
      setNotFoundError(err.message || 'No repair record found with that Repair ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (ticketIdInput.trim()) {
      setSearchParams({ id: ticketIdInput.trim() });
      fetchTicket(ticketIdInput.trim());
    }
  };

  const handleQuoteAction = async (action) => {
    if (!ticket) return;
    setQuoteSubmitting(true);
    try {
      const res = await api.post(`/repairs/track/${ticket.ticketId}/quote`, { action });
      setTicket(res.data.data);
      success(`Quote ${action === 'approve' ? 'approved' : 'declined'} successfully!`);
    } catch (err) {
      toastError(err.message || 'Failed to update quote decision');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
          Real-Time Diagnostic Lab
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Repair Status Tracker
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Enter your unique Repair Tracking ID (e.g. AMB-9482) to view current diagnostic status and technician notes.
        </p>

        {/* Search Input Box */}
        <form
          onSubmit={handleSearch}
          className="flex items-center rounded-2xl p-1.5 bg-white dark:bg-zinc-900 shadow-apple-lg border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-apple-blue transition-all mt-4"
        >
          <div className="pl-3 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            placeholder="Enter Repair ID (e.g. AMB-9482)"
            value={ticketIdInput}
            onChange={(e) => setTicketIdInput(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            {loading ? 'Searching...' : 'Lookup Ticket'}
          </button>
        </form>

        {/* Quick Demo Pre-fills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-zinc-500">
          <span>Try demo IDs:</span>
          {['AMB-9482', 'AMB-3821', 'AMB-7719', 'AMB-1054'].map((id) => (
            <button
              key={id}
              onClick={() => {
                setTicketIdInput(id);
                setSearchParams({ id });
                fetchTicket(id);
              }}
              className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-[11px] hover:bg-apple-blue hover:text-white transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse space-y-6">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      )}

      {/* Not Found Error */}
      {!loading && notFoundError && (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            Ticket Not Found
          </h3>
          <p className="text-xs text-zinc-500">{notFoundError}</p>
          <div className="pt-2">
            <Link
              to="/repairs/book"
              className="px-4 py-2 rounded-full bg-apple-blue text-white text-xs font-semibold inline-block"
            >
              Book a New Repair
            </Link>
          </div>
        </div>
      )}

      {/* Found Ticket Tracking Visualizer */}
      {!loading && ticket && (
        <div className="space-y-8">
          {/* Main Status Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-lg space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
                    Active Repair Record
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-apple-blue font-semibold">
                    {ticket.priority}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1 flex items-center gap-2">
                  <span>{ticket.ticketId}</span>
                  <span className="text-sm font-medium text-zinc-400">
                    • {ticket.macbookModel}
                  </span>
                </h2>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-zinc-400">Current Tracking Status</span>
                <span className="text-base font-bold text-apple-blue mt-0.5">
                  {ticket.status}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  Checked in {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* 5-Stage Visual Progress Bar */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
                Repair Lifecycle Stages
              </h4>

              {/* Desktop Stepper */}
              <div className="hidden md:grid grid-cols-5 gap-2 relative">
                {/* Connecting track */}
                <div className="absolute top-5 left-8 right-8 h-1 bg-zinc-200 dark:bg-zinc-800 -z-0" />
                <div
                  className="absolute top-5 left-8 h-1 bg-apple-blue transition-all duration-500 -z-0"
                  style={{
                    width: `${(ticket.currentStageIndex / 4) * 100}%`,
                  }}
                />

                {STAGE_STEPS.map((stage) => {
                  const isCompleted = ticket.currentStageIndex > stage.index;
                  const isCurrent = ticket.currentStageIndex === stage.index;

                  return (
                    <div
                      key={stage.index}
                      className="flex flex-col items-center text-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-apple-sm'
                            : isCurrent
                            ? 'bg-apple-blue text-white ring-4 ring-blue-500/20 shadow-apple-glow animate-pulse'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Wrench className="w-5 h-5" />
                        ) : (
                          stage.index + 1
                        )}
                      </div>

                      <span
                        className={`text-xs mt-3 font-semibold leading-tight max-w-[110px] ${
                          isCurrent
                            ? 'text-apple-blue font-bold'
                            : isCompleted
                            ? 'text-zinc-800 dark:text-zinc-200'
                            : 'text-zinc-400'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Stepper View */}
              <div className="md:hidden space-y-3">
                {STAGE_STEPS.map((stage) => {
                  const isCompleted = ticket.currentStageIndex > stage.index;
                  const isCurrent = ticket.currentStageIndex === stage.index;

                  return (
                    <div
                      key={stage.index}
                      className={`p-3 rounded-2xl flex items-center gap-3 border ${
                        isCurrent
                          ? 'border-apple-blue bg-blue-50/60 dark:bg-blue-950/40 text-apple-blue'
                          : isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900/40 text-emerald-600'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-apple-blue text-white'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.index + 1}
                      </div>
                      <span className="text-xs font-semibold">{stage.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Quote Approval Banner (if in stage 1 or quote pending) */}
            {ticket.currentStageIndex === 1 && ticket.quoteStatus === 'Pending' && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                      Official Quote Awaiting Your Approval
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Our certified diagnostic inspection is complete. Total itemized repair cost:{' '}
                      <strong className="text-base text-zinc-900 dark:text-white">
                        ${ticket.finalCost || ticket.estimatedCost}
                      </strong>
                      . Parts and 1-year warranty included.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleQuoteAction('approve')}
                    disabled={quoteSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve & Authorize Repair</span>
                  </button>
                  <button
                    onClick={() => handleQuoteAction('decline')}
                    disabled={quoteSubmitting}
                    className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-300 transition-colors flex items-center gap-1.5"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Decline Quote</span>
                  </button>
                </div>
              </div>
            )}

            {/* Technician Diagnostic Notes */}
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-apple-blue" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Technician Diagnostic Log
                </span>
                <span className="text-[11px] text-zinc-400 ml-auto">
                  Assigned: {ticket.assignedTechnician || 'Ahad Certified Tech'}
                </span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                {ticket.technicianNotes || 'Initial bench evaluation underway.'}
              </p>
            </div>
          </div>

          {/* Details & Specs Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device & Issue Summary */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-apple-blue" />
                <span>Device & Problem Context</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Model Line</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {ticket.macbookModel}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Issue Category</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {ticket.issueCategory}
                  </span>
                </div>
                {ticket.serialNumber && (
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Serial Number</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">
                      {ticket.serialNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Handover Method</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {ticket.deliveryMethod}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-zinc-400 block mb-1">Customer Reported Symptom:</span>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    "{ticket.issueDescription}"
                  </p>
                </div>
              </div>
            </div>

            {/* Financial & Warranty Summary */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-sm space-y-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Estimate & Quote Status</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Estimated Baseline</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    ${ticket.estimatedCost}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Final Itemized Cost</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-white">
                    ${ticket.finalCost || ticket.estimatedCost}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Quote Approval Status</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      ticket.quoteStatus === 'Approved'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : ticket.quoteStatus === 'Declined'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {ticket.quoteStatus || 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Post-Repair Coverage</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    1-Year Ahad Hardware Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairTracker;
