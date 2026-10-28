const jwt = require('jsonwebtoken');
const DataStore = require('../services/dataStore');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ahad_macbook_super_secret_jwt_key_2026_apple_certified'
      );

      const user = await DataStore.users.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

// Middleware to restrict access to administrators only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required',
    });
  }
};

// Optional auth: attaches req.user if valid token present, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ahad_macbook_super_secret_jwt_key_2026_apple_certified'
      );
      const user = await DataStore.users.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // Continue without user
    }
  }
  next();
};

module.exports = { protect, admin, optionalAuth };
