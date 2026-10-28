import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Cpu,
  Layers,
  Battery,
  Monitor,
  CheckCircle2,
  Share2,
  Clock,
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-6 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="text-xl font-bold">MacBook Not Found</h2>
        <p className="text-xs text-zinc-500 mt-2">
          The requested MacBook model may have been sold or removed.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block px-5 py-2.5 rounded-full bg-apple-blue text-white text-xs font-semibold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-apple-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Left: High-Res Image Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple-md">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md">
                {product.condition}
              </span>
              {product.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-apple-blue text-white">
                  Featured
                </span>
              )}
            </div>
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:text-apple-blue transition-colors shadow-sm"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-xl overflow-hidden w-20 h-20 flex-shrink-0 border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-apple-blue ring-2 ring-apple-blue/30 scale-105'
                      : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Action */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
                {product.modelFamily} • {product.screenSize}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <div className="flex items-center text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span className="font-bold text-zinc-800 dark:text-zinc-200 mr-1">
                  {product.rating}
                </span>
                <span className="text-zinc-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-zinc-400 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specs Pills */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-medium block">Chip</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{product.chip}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-medium block">Unified Memory</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{product.ram}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-medium block">Fast SSD</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{product.storage}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-medium block">Color</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{product.color}</span>
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="mt-6 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {product.stock > 3
                  ? 'In Stock & Ready for Immediate Dispatch'
                  : product.stock > 0
                  ? `Low Stock: Only ${product.stock} units remaining`
                  : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart Controls */}
            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-full px-2 py-1 bg-white dark:bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2 py-1 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-apple-blue"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-sm font-semibold shadow-apple-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ${(product.price * quantity).toLocaleString()}</span>
                </button>
              </div>
            )}

            {/* Assurances list */}
            <div className="mt-8 space-y-2.5 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>Warranty:</strong> {product.specs?.warranty || '1-Year Comprehensive Hardware Warranty'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-apple-blue flex-shrink-0" />
                <span>
                  <strong>Delivery:</strong> Free 2-Day Insured FedEx Express Air Shipping
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Battery className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong>Battery Health:</strong> {product.specs?.batteryHealth || '100%'} ({product.specs?.cycleCount || 0} cycles)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications Table */}
      <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Detailed Technical Specifications
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            Hardware verification benchmarking verified by certified Apple technicians.
          </p>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-apple-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Processor</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.specs?.processorDetails || `Apple Silicon ${product.chip}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Display</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.specs?.display || `${product.screenSize} Liquid Retina display`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Memory & Storage</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.ram} Unified Memory • {product.storage} PCIe NVMe SSD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Battery & Power</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.specs?.batteryHealth || '100%'} (Verified Cycle Count: {product.specs?.cycleCount || 1})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Ports & Expansion</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.specs?.ports?.join(', ') || 'Thunderbolt / USB 4, MagSafe 3, 3.5mm Headphone Jack'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Weight & Portability</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0">
                {product.specs?.weight || '3.5 lbs'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Ahad Certified Testing</span>
              <span className="sm:col-span-2 font-medium text-zinc-900 dark:text-zinc-100 mt-1 sm:mt-0 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Passed 50-Point Hardware, Keyboard, Display & Thermal Stress Diagnostic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
