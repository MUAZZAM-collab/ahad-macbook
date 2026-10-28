import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/shop');
    } catch {
      // Error is caught and toasted in context
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-sm">
          <Laptop className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Create Ahad MacBook ID
        </h1>
        <p className="text-xs text-zinc-500">
          Sign up to purchase certified Apple MacBooks and track repair tickets.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-apple-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Create Password * (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-apple-glow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Registering...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-apple-blue font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
