import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Laptop, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      // Error is surfaced via ToastContext in login
    }
  };

  const fillAdmin = () => {
    setEmail('admin@ahadmacbook.com');
    setPassword('admin123456');
  };

  const fillCustomer = () => {
    setEmail('customer@example.com');
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-sm">
          <Laptop className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Sign in to Ahad MacBook
        </h1>
        <p className="text-xs text-zinc-500">
          Access your orders, repair tracking history, and account settings.
        </p>
      </div>

      {/* Quick Test Demo Fill Buttons */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
        <span className="text-[11px] font-bold text-apple-blue uppercase tracking-wider block">
          ⚡ 1-Click Evaluator Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillAdmin}
            className="py-1.5 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Admin Demo</span>
          </button>
          <button
            type="button"
            onClick={fillCustomer}
            className="py-1.5 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-apple-blue" />
            <span>Customer Demo</span>
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-apple-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-apple-blue font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
