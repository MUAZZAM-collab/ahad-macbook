import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  Check,
  RotateCcw,
  Star,
  Cpu,
  Layers,
  HardDrive,
  Eye,
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [modelFamily, setModelFamily] = useState(searchParams.get('modelFamily') || '');
  const [chip, setChip] = useState(searchParams.get('chip') || '');
  const [screenSize, setScreenSize] = useState(searchParams.get('screenSize') || '');
  const [ram, setRam] = useState(searchParams.get('ram') || '');
  const [storage, setStorage] = useState(searchParams.get('storage') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '4500');

  useEffect(() => {
    fetchProducts();
  }, [modelFamily, chip, screenSize, ram, storage, condition, sort, maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (modelFamily) params.modelFamily = modelFamily;
      if (chip) params.chip = chip;
      if (screenSize) params.screenSize = screenSize;
      if (ram) params.ram = ram;
      if (storage) params.storage = storage;
      if (condition) params.condition = condition;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await api.get('/products', { params });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearAllFilters = () => {
    setSearch('');
    setModelFamily('');
    setChip('');
    setScreenSize('');
    setRam('');
    setStorage('');
    setCondition('');
    setSort('newest');
    setMaxPrice('4500');
    setSearchParams({});
  };

  const chipsList = ['M1', 'M1 Pro', 'M1 Max', 'M2', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max'];
  const sizesList = ['13-inch', '14-inch', '15-inch', '16-inch'];
  const ramList = ['8GB', '16GB', '18GB', '32GB', '36GB', '64GB'];
  const storageList = ['256GB', '512GB', '1TB', '2TB'];
  const conditionsList = ['New', 'Open Box', 'Refurbished'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
            Apple Certified Hardware
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
            MacBook Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Browse our complete selection of MacBook Pro and MacBook Air laptops powered by Apple Silicon.
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 md:w-72 flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-apple-blue"
          >
            <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search MacBook, M3, 36GB..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </form>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-3 py-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-apple-blue" />
              <span>Filter MacBooks</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-zinc-500 hover:text-apple-blue flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Model Family */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Model Lineup
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['MacBook Pro', 'MacBook Air'].map((m) => (
                <button
                  key={m}
                  onClick={() => setModelFamily(modelFamily === m ? '' : m)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    modelFamily === m
                      ? 'bg-apple-blue text-white border-apple-blue shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Condition
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conditionsList.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(condition === cond ? '' : cond)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    condition === cond
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Apple Silicon Chip */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Apple Silicon Chip
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {chipsList.map((c) => (
                <button
                  key={c}
                  onClick={() => setChip(chip === c ? '' : c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    chip === c
                      ? 'bg-apple-blue text-white border-apple-blue shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Size */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Screen Size
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {sizesList.map((size) => (
                <button
                  key={size}
                  onClick={() => setScreenSize(screenSize === size ? '' : size)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    screenSize === size
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Unified Memory */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Unified Memory (RAM)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ramList.map((r) => (
                <button
                  key={r}
                  onClick={() => setRam(ram === r ? '' : r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    ram === r
                      ? 'bg-apple-blue text-white border-apple-blue'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Fast SSD Storage
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {storageList.map((s) => (
                <button
                  key={s}
                  onClick={() => setStorage(storage === s ? '' : s)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    storage === s
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              <span>Max Budget</span>
              <span className="text-apple-blue font-bold">${Number(maxPrice).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-apple-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>$500</span>
              <span>$5,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active Filters Pills */}
          {(modelFamily || chip || screenSize || ram || storage || condition || search) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 font-medium">Active filters:</span>
              {modelFamily && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm">
                  {modelFamily}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setModelFamily('')} />
                </span>
              )}
              {chip && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm">
                  {chip}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setChip('')} />
                </span>
              )}
              {condition && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm">
                  {condition}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setCondition('')} />
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm">
                  "{search}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-apple-blue hover:underline ml-auto font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-3xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
              <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                No matching MacBooks found
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Try loosening your filter parameters or search terms to see available configurations.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-5 px-5 py-2.5 rounded-full bg-apple-blue text-white text-xs font-semibold shadow-sm hover:bg-apple-blue-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-apple-sm hover:shadow-apple-md transition-all duration-200"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800/80 mb-4">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/75 text-white backdrop-blur-md">
                          {product.condition}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-apple-blue text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 dark:bg-black/90 text-zinc-800 dark:text-zinc-200 backdrop-blur-sm">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                        </span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base line-clamp-1 group-hover:text-apple-blue transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Chips & Specs Pill Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {product.chip}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {product.ram}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {product.storage}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {product.screenSize}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-zinc-900 dark:text-white">
                        ${product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-zinc-400 line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            Save ${(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        title="View Technical Specs"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                          product.stock > 0
                            ? 'bg-apple-blue hover:bg-apple-blue-hover text-white hover:shadow-apple-glow'
                            : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-zinc-900 h-full p-6 overflow-y-auto shadow-apple-lg border-l border-zinc-200 dark:border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-base">Filter MacBooks</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Mobile filters repetition */}
            <div>
              <label className="text-xs font-semibold block mb-2">Model</label>
              <div className="grid grid-cols-2 gap-2">
                {['MacBook Pro', 'MacBook Air'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setModelFamily(modelFamily === m ? '' : m)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border ${
                      modelFamily === m
                        ? 'bg-apple-blue text-white border-apple-blue'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditionsList.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setCondition(condition === cond ? '' : cond)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      condition === cond
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-apple-blue text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
