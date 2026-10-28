import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Laptop,
  Wrench,
  ShieldCheck,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Cpu,
  BatteryCharging,
  Droplets,
  Star,
  Activity,
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackerInput, setTrackerInput] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?limit=4');
        setFeaturedProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackerInput.trim()) {
      navigate(`/repairs/track?id=${encodeURIComponent(trackerInput.trim())}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Apple Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-6 backdrop-blur-md border border-zinc-300/40 dark:border-zinc-700/50">
            <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
            <span>Introducing M3 Max MacBook Pros & Next-Gen Repair Lab</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.08]">
            Engineered for Excellence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue via-indigo-500 to-sky-400">
              Repaired by Certified Experts.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Discover precision Apple MacBooks tested to rigorous 50-point standards, paired with world-class component-level repair diagnostics and genuine hardware care.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm sm:text-base hover:opacity-90 shadow-apple-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore MacBooks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/repairs/book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-semibold text-sm sm:text-base shadow-apple-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Book a Repair</span>
            </Link>
          </div>

          {/* Quick Repair Status Lookup Box */}
          <div className="mt-12 max-w-md mx-auto">
            <form
              onSubmit={handleTrackSubmit}
              className="flex items-center rounded-2xl p-1.5 bg-white dark:bg-zinc-900 shadow-apple-lg border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-apple-blue transition-all"
            >
              <div className="pl-3 text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Track repair by ID (e.g. AMB-9482)"
                value={trackerInput}
                onChange={(e) => setTrackerInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Track Now
              </button>
            </form>
            <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
              <span>Quick test demo:</span>
              <button
                onClick={() => setTrackerInput('AMB-9482')}
                className="text-apple-blue hover:underline font-mono"
              >
                AMB-9482
              </button>
              <span>•</span>
              <button
                onClick={() => setTrackerInput('AMB-3821')}
                className="text-apple-blue hover:underline font-mono"
              >
                AMB-3821
              </button>
            </div>
          </div>
        </div>

        {/* Hero MacBook Showcase Image */}
        <div className="max-w-5xl mx-auto px-4 mt-12 sm:mt-16">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-800 to-black p-2 sm:p-4">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=85"
              alt="MacBook Pro Lineup"
              className="w-full h-72 sm:h-[450px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <div className="text-left text-white max-w-lg">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase">
                  Flagship Performance
                </span>
                <h3 className="text-xl sm:text-3xl font-bold mt-2">
                  MacBook Pro 16" with M3 Max
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  16-core CPU, 40-core GPU, Liquid Retina XDR display. Inspected, certified, and ready to ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-apple-blue flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              1-Year Ahad Warranty
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Every MacBook and repair includes full hardware replacement warranty coverage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Apple Silicon Certified
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Specialized diagnostics for M1, M2, and M3 architecture logic boards and components.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              24-48h Rapid Turnaround
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Same-day screen swaps and expedited board micro-soldering with live status tracking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Insured Free Shipping
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Complimentary 2-day FedEx air delivery on all computer orders and mail-in repairs.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured MacBooks Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
              Curated Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              Featured MacBooks in Stock
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Hand-tested, benchmarked, and sanitized with verified battery health.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-apple-blue hover:text-apple-blue-hover"
          >
            <span>View All MacBooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col justify-between p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm hover:shadow-apple-md transition-all duration-200"
              >
                <div>
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800/80 mb-4">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur-md">
                        {product.condition}
                      </span>
                    </div>
                  </div>

                  {/* Title & specs */}
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-1 group-hover:text-apple-blue transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                      {product.chip}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                      {product.ram}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                      {product.storage}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-zinc-900 dark:text-white">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="block text-[11px] text-zinc-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/product/${product._id}`}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Specs
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-apple-blue hover:bg-apple-blue-hover text-white transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Professional Repair Services Spectrum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Ahad Repair Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Specialized MacBook Hardware Services
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed">
              From cracked Liquid Retina screens to liquid damaged logic boards with micro-soldering, our technicians use specialized stereomicroscopes and OEM calibration gear.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-sky-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Retina Display Swaps</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    OEM color calibration, True Tone sensor preservation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Battery Renewal</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Original capacity cells with cycle resets and 100% health.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Water Damage Restoration</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ultrasonic solvent bath & corrosion remediation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Logic Board Micro-soldering</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Component-level capacitor and power rail repair.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/repairs/book"
                className="px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-apple-md"
              >
                Schedule MacBook Repair
              </Link>
              <Link
                to="/repairs/estimate"
                className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all"
              >
                Calculate Instant Estimate
              </Link>
            </div>
          </div>

          {/* Background decorative glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-apple-blue/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-1">
            Trusted by Creators, Developers & Pros
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "Apple quoted me over $800 to swap my entire logic board after a coffee spill. Ahad MacBook diagnosed a shorted capacitor and fixed it in 36 hours for $350. My MacBook Pro 16 is like brand new."
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Marcus V.
                </p>
                <p className="text-[10px] text-zinc-400">iOS Lead Engineer</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-semibold">
                Repair AMB-9482
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "Purchased an Open Box MacBook Pro 14 M3 Pro. Delivery took only 2 days, condition was literally untouched with 100% battery and 0 cycle count in original retail box. Best Mac buying experience ever."
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Elena R.
                </p>
                <p className="text-[10px] text-zinc-400">UX Design Director</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-apple-blue font-semibold">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "The online repair tracker is extraordinary. Watching the device move from diagnosis to quote approval to quality testing in real-time gave me 100% confidence. Truly professional Apple service."
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  David K.
                </p>
                <p className="text-[10px] text-zinc-400">Photographer</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-semibold">
                Repair AMB-7719
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
