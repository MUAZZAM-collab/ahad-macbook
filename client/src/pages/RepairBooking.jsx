import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Laptop,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  User,
  AlertTriangle,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RepairBooking = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Wizard Step (1 to 4)
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    macbookModel: searchParams.get('model') || '',
    issueCategory: searchParams.get('issue') || '',
    issueDescription: '',
    serialNumber: '',
    priority: 'Standard',
    deliveryMethod: 'Drop-off in Store',
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerEmail: prev.customerEmail || user.email || '',
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  const macbookModels = [
    'MacBook Pro 16" (M1/M2/M3 Pro & Max)',
    'MacBook Pro 14" (M1/M2/M3 Pro & Max)',
    'MacBook Pro 13" (M1/M2 or Intel)',
    'MacBook Air 15" (M2/M3)',
    'MacBook Air 13" (M2/M3)',
    'MacBook Air 13" (M1, 2020)',
    'Other / Older Intel MacBook',
  ];

  const issueCategories = [
    {
      id: 'Screen Replacement',
      title: 'Screen Replacement',
      desc: 'Cracked glass, black display, vertical lines, flickering Retina panel',
      est: '$279 - $589',
    },
    {
      id: 'Battery Service',
      title: 'Battery Service',
      desc: 'Service recommended warning, rapid drain, device swelling or sudden shutoff',
      est: '$129 - $199',
    },
    {
      id: 'Logic Board Repair',
      title: 'Logic Board Repair',
      desc: 'No power, boot loop, power surge, micro-soldering capacitor replacement',
      est: '$249 - $449',
    },
    {
      id: 'Keyboard & Trackpad',
      title: 'Keyboard & Trackpad',
      desc: 'Unresponsive keys, sticky mechanism, haptic trackpad failure',
      est: '$149 - $249',
    },
    {
      id: 'Water Damage',
      title: 'Water Damage',
      desc: 'Emergency liquid spill, ultrasonic cleaning and corrosion treatment',
      est: '$269 - $489',
    },
    {
      id: 'Other',
      title: 'Other / Diagnostic Inspection',
      desc: 'Port issues, thermal overheating, audio failure, or general diagnostics',
      est: '$89 - $149',
    },
  ];

  const deliveryOptions = [
    {
      id: 'Drop-off in Store',
      title: 'In-Store Drop-off',
      desc: 'Bring your MacBook directly to our Cupertino repair lab. Free initial check-in inspection.',
    },
    {
      id: 'Mail-in Service',
      title: 'Mail-in Service (Insured)',
      desc: 'We send a prepaid protective shipping box with FedEx overnight return label.',
    },
    {
      id: 'On-site Pickup',
      title: 'Courier Pickup',
      desc: 'Available for Bay Area residential and corporate clients.',
    },
  ];

  const handleNext = () => {
    if (step === 1 && !formData.macbookModel) {
      toastError('Please select your MacBook model');
      return;
    }
    if (step === 2) {
      if (!formData.issueCategory) {
        toastError('Please select an issue category');
        return;
      }
      if (!formData.issueDescription.trim()) {
        toastError('Please provide a brief description of the issue');
        return;
      }
    }
    if (step === 3) {
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        toastError('Please fill in your contact information');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/repairs', formData);
      const ticket = res.data.data;
      setBookingResult(ticket);
      success(`Repair booked successfully! Your Repair ID is ${ticket.ticketId}`);
    } catch (err) {
      toastError(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully booked, show Apple confirmation screen
  if (bookingResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Booking Confirmed
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Your MacBook Repair is Registered
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            A confirmation receipt and packing slip have been dispatched to{' '}
            <strong>{bookingResult.customerEmail}</strong>.
          </p>
        </div>

        {/* Repair ID Highlight Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-lg text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500">Official Repair Tracking ID</span>
            <span className="text-lg font-mono font-bold text-apple-blue bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl">
              {bookingResult.ticketId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-zinc-400 block">Model</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {bookingResult.macbookModel}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Issue</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {bookingResult.issueCategory}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Delivery Method</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {bookingResult.deliveryMethod}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Estimated Baseline</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                ${bookingResult.estimatedCost}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate(`/repairs/track?id=${bookingResult.ticketId}`)}
            className="px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-semibold shadow-apple-md transition-all flex items-center justify-center gap-2"
          >
            <span>Track Repair Status Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
          Certified Hardware Lab
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
          Book a MacBook Repair
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          Tell us about your machine and symptoms. Our certified technicians will prepare your diagnostic bench.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
          {[
            { num: 1, title: 'Model' },
            { num: 2, title: 'Issue' },
            { num: 3, title: 'Contact' },
            { num: 4, title: 'Review' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-apple-blue text-white shadow-apple-sm'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-semibold mt-1 text-zinc-600 dark:text-zinc-400">
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-apple-md">
        {/* STEP 1: Select Model */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Step 1: Select your MacBook Model
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Choose the model configuration closest to your laptop.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {macbookModels.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setFormData({ ...formData, macbookModel: model })}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    formData.macbookModel === model
                      ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 text-apple-blue shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">{model}</span>
                  </div>
                  {formData.macbookModel === model && (
                    <CheckCircle2 className="w-4 h-4 text-apple-blue" />
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Or enter specific model / serial number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. A2991 or Serial Number C02..."
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Issue & Description */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Step 2: Describe the Problem
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Select primary symptom and provide context on what happened.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issueCategories.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, issueCategory: issue.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.issueCategory === issue.id
                      ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {issue.title}
                    </span>
                    <span className="text-[10px] font-semibold text-apple-blue">
                      {issue.est}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                    {issue.desc}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Detailed Problem Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe symptoms (e.g. dropped on floor, water spill on keyboard, no power light, error message)..."
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
              />
            </div>

            {/* Service Priority */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Service Priority
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'Standard' })}
                  className={`p-3 rounded-xl border text-left text-xs font-medium ${
                    formData.priority === 'Standard'
                      ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 text-apple-blue'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="font-semibold">Standard Service</div>
                  <div className="text-[10px] text-zinc-400">2-4 Business Days</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'Rush / Express' })}
                  className={`p-3 rounded-xl border text-left text-xs font-medium ${
                    formData.priority === 'Rush / Express'
                      ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 text-apple-blue'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="font-semibold">Rush / Express Service</div>
                  <div className="text-[10px] text-zinc-400">Same-Day / 24-Hour Queue Priority</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Info & Delivery */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Step 3: Contact & Delivery Preference
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Where should we notify you of your diagnostic report and live tracking?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
                Delivery / Handover Method
              </label>
              <div className="space-y-2.5">
                {deliveryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: opt.id })}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      formData.deliveryMethod === opt.id
                        ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {opt.title}
                      </span>
                      {formData.deliveryMethod === opt.id && (
                        <CheckCircle2 className="w-4 h-4 text-apple-blue" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Step 4: Review Repair Booking
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Verify details before booking. You will receive an official Repair ID (e.g., AMB-XXXX) to track progress.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-5 divide-y divide-zinc-200 dark:divide-zinc-700/60 space-y-3 text-xs">
              <div className="flex justify-between pb-2">
                <span className="text-zinc-500">MacBook Model</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formData.macbookModel}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Service Category</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formData.issueCategory}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Delivery Preference</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formData.deliveryMethod}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Priority</span>
                <span className="font-semibold text-apple-blue">
                  {formData.priority}
                </span>
              </div>
              <div className="py-2">
                <span className="text-zinc-500 block mb-1">Issue Description</span>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {formData.issueDescription}
                </p>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-zinc-500">Contact Details</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                  {formData.customerName} • {formData.customerPhone} <br />
                  <span className="text-zinc-400 font-normal">{formData.customerEmail}</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-apple-blue flex-shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Ahad Certified Repair Guarantee
                </p>
                <p className="mt-0.5 text-zinc-500">
                  Zero diagnostic fee if unrepairable. You will receive an exact quote upon technician inspection before any billable work begins.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="px-8 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-bold transition-all shadow-apple-md hover:shadow-apple-glow disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Registering Booking...' : 'Confirm Repair Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairBooking;
