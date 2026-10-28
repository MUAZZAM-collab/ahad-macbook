const jwt = require('jsonwebtoken');
const DataStore = require('../services/dataStore');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ahad_macbook_super_secret_jwt_key_2026_apple_certified',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await DataStore.users.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const user = await DataStore.users.create({
      name,
      email,
      password,
      phone: phone || '',
      address: address || { country: 'United States' },
      role: 'customer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token,
      },
      message: 'Account successfully registered',
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error registering user',
    });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await DataStore.users.findByEmail(email, true);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error logging in',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await DataStore.users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await DataStore.users.findAll();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
};
