import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import RepairBooking from './pages/RepairBooking';
import RepairTracker from './pages/RepairTracker';
import EstimateCalculator from './pages/EstimateCalculator';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-[#f5f5f7] dark:bg-[#0d0d0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
                <Navbar />
                <CartDrawer />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/repairs/book" element={<RepairBooking />} />
                    <Route path="/repairs/track" element={<RepairTracker />} />
                    <Route path="/repairs/estimate" element={<EstimateCalculator />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
