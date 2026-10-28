import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  Laptop,
  Wrench,
  ShieldCheck,
  Clock,
  ArrowRight,
  DollarSign,
  Sparkles,
  Info,
} from 'lucide-react';
import api from '../utils/api';

const EstimateCalculator = () => {
  const [matrix, setMatrix] = useState({});
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await api.get('/repairs/estimate-matrix');
        const data = res.data;
        setMatrix(data.data || {});
        setModels(data.models || []);
        setCategories(data.categories || []);
        if (data.models?.length > 0) setSelectedModel(data.models[4]); // default to Pro 14"
        if (data.categories?.length > 0) setSelectedCategory(data.categories[0]); // default to Screen
      } catch (err) {
        console.error('Failed to load matrix', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  const currentPrice =
    matrix[selectedModel] && matrix[selectedModel][selectedCategory]
      ? matrix[selectedModel][selectedCategory]
      : 299;

  // Breakdown calculations
  const partsEst = Math.round(currentPrice * 0.65);
  const laborEst = currentPrice - partsEst;

  const handleBookNow = () => {
    const params = new URLSearchParams({
      model: selectedModel,
      issue: selectedCategory,
    });
    navigate(`/repairs/book?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Instant Repair Estimate Calculator
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Get an immediate upfront cost estimate for standard Apple MacBook repairs. No hidden labor fees.
        </p>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls: Model & Issue Selection */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-apple-md space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                1. Select MacBook Model
              </label>
              <div className="space-y-1.5">
                {models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedModel(m)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      selectedModel === m
                        ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 text-apple-blue shadow-sm font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    <span>{m}</span>
                    <Laptop className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                2. Select Repair Service Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedCategory === cat
                        ? 'border-apple-blue bg-blue-50/70 dark:bg-blue-950/40 text-apple-blue shadow-sm font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Result Card */}
          <div className="lg:col-span-5 bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-apple-lg border border-zinc-800 space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                Baseline Estimate
              </span>

              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  ${currentPrice}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Estimated total parts & certified diagnostic labor
                </p>
              </div>

              {/* Itemized breakdown */}
              <div className="divide-y divide-zinc-800 rounded-2xl bg-white/5 p-4 text-xs space-y-2 border border-white/10">
                <div className="flex justify-between pb-1">
                  <span className="text-zinc-400">Model Line</span>
                  <span className="font-semibold text-right text-zinc-200 max-w-[180px] truncate">
                    {selectedModel}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Component Parts (OEM Grade)</span>
                  <span className="font-semibold text-zinc-200">${partsEst}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Bench Labor & Calibration</span>
                  <span className="font-semibold text-zinc-200">${laborEst}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Diagnostic Check</span>
                  <span className="font-semibold text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-zinc-400">Turnaround Estimate</span>
                  <span className="font-semibold text-zinc-200">24–48 Hours</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Includes 1-Year Ahad Comprehensive Hardware Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>No payment due until quote approved & repair complete</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 px-6 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-bold shadow-apple-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Book This Repair Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient background glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-apple-blue/20 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateCalculator;
