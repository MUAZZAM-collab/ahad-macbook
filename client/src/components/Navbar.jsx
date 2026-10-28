import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Laptop,
  Wrench,
  Search,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ShieldCheck,
  Calculator,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { itemsCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'MacBook Store', path: '/shop' },
    { name: 'Book Repair', path: '/repairs/book' },
    { name: 'Track Repair', path: '/repairs/track' },
    { name: 'Instant Estimate', path: '/repairs/estimate' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-zinc-900 dark:text-white font-semibold text-lg tracking-tight group"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                Ahad <span className="text-apple-blue font-semibold">MacBook</span>
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 -mt-1 font-medium tracking-wide">
                Sales & Certified Repair Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-apple-blue bg-blue-50/80 dark:bg-blue-950/40 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons: Theme Toggle, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              aria-label="Shopping Cart"
              className="relative p-2 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-apple-blue text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard quick pill */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1 px-3 py-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                Admin
              </Link>
            )}

            {/* User Account Menu / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <div className="w-6 h-6 rounded-full bg-apple-blue text-white flex items-center justify-center text-[11px] font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onClick={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-zinc-900 shadow-apple-lg border border-zinc-200 dark:border-zinc-800 py-2 z-50 text-sm"
                  >
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-400">Signed in as</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                        {user.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <ShoppingBag className="w-4 h-4 text-zinc-400" />
                      My Orders
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all duration-150 hover:shadow-apple-glow"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-apple-blue font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
