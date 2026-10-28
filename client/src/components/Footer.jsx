import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, ShieldCheck, Wrench, Heart, Clock, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] text-zinc-600 dark:text-zinc-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold text-base">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
                <Laptop className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Ahad <span className="text-apple-blue">MacBook</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-zinc-500 dark:text-zinc-400">
              The premier destination for certified Apple MacBooks and specialized board-level repair engineering. Every MacBook and repair is backed by our comprehensive warranty and certified diagnostic standards.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-apple-blue" />
                <span>1 Infinite Loop Suite 400, Cupertino & Express Mail-in Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-apple-blue" />
                <span>+1 (800) 555-AHAD • Mon - Sat: 9:00 AM - 7:00 PM PST</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-apple-blue" />
                <span>support@ahadmacbook.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: MacBook Sales */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-200 text-sm mb-3">
              MacBook Sales
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?modelFamily=MacBook+Pro" className="hover:text-apple-blue transition-colors">
                  MacBook Pro (14" & 16")
                </Link>
              </li>
              <li>
                <Link to="/shop?modelFamily=MacBook+Air" className="hover:text-apple-blue transition-colors">
                  MacBook Air (13" & 15")
                </Link>
              </li>
              <li>
                <Link to="/shop?chip=M3,M3+Pro,M3+Max" className="hover:text-apple-blue transition-colors">
                  M3 Series Powerhouses
                </Link>
              </li>
              <li>
                <Link to="/shop?condition=Refurbished" className="hover:text-apple-blue transition-colors">
                  Certified Refurbished
                </Link>
              </li>
              <li>
                <Link to="/shop?condition=Open+Box" className="hover:text-apple-blue transition-colors">
                  Open Box Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Repair Lab */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-200 text-sm mb-3">
              Repair Lab
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/repairs/book" className="hover:text-apple-blue transition-colors">
                  Book a Repair
                </Link>
              </li>
              <li>
                <Link to="/repairs/track" className="hover:text-apple-blue transition-colors">
                  Repair Status Tracker
                </Link>
              </li>
              <li>
                <Link to="/repairs/estimate" className="hover:text-apple-blue transition-colors">
                  Instant Estimate Tool
                </Link>
              </li>
              <li>
                <Link to="/repairs/book?issue=Screen+Replacement" className="hover:text-apple-blue transition-colors">
                  Retina Screen Swaps
                </Link>
              </li>
              <li>
                <Link to="/repairs/book?issue=Logic+Board+Repair" className="hover:text-apple-blue transition-colors">
                  Micro-soldering & Logic Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Guarantees */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-200 text-sm mb-3">
              Certified Assurance
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  1-Year Comprehensive Hardware Warranty on all machines
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-apple-blue mt-0.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  Apple Silicon certified technicians using grade-A parts
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  24–48 hour rapid turnaround on standard hardware repairs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Ahad MacBook Inc. All rights reserved. Apple, MacBook, MacBook Pro, MacBook Air, and Apple Silicon are trademarks of Apple Inc.
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Warranty Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
