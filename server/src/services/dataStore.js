const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const RepairTicket = require('../models/RepairTicket');
const Order = require('../models/Order');
const {
  initialUsers,
  initialProducts,
  initialRepairTickets,
  initialOrders,
} = require('../utils/seedData');

// Fallback in-memory collections
let memUsers = [];
let memProducts = [];
let memRepairTickets = [];
let memOrders = [];

// Initialize memory store with hashed passwords and cloned data
const initMemoryStore = async () => {
  memUsers = await Promise.all(
    initialUsers.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return {
        ...u,
        password: hashedPassword,
        matchPassword: async function (candidate) {
          return bcrypt.compare(candidate, this.password);
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  memProducts = initialProducts.map((p) => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  memRepairTickets = initialRepairTickets.map((t) => ({
    ...t,
    createdAt: t.createdAt || new Date(),
    updatedAt: new Date(),
  }));

  memOrders = initialOrders.map((o) => ({
    ...o,
    createdAt: o.createdAt || new Date(),
    updatedAt: new Date(),
  }));
};

// Seed MongoDB if connected and empty
const seedMongoIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Seeding initial users into MongoDB...');
      for (const u of initialUsers) {
        await User.create(u);
      }
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      console.log('[Database] Seeding initial products into MongoDB...');
      await Product.insertMany(initialProducts);
    }

    const ticketCount = await RepairTicket.countDocuments();
    if (ticketCount === 0) {
      console.log('[Database] Seeding initial repair tickets into MongoDB...');
      await RepairTicket.insertMany(initialRepairTickets);
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('[Database] Seeding initial orders into MongoDB...');
      await Order.insertMany(initialOrders);
    }
  } catch (err) {
    console.warn('[Database] Seed check warning:', err.message);
  }
};

const isMongooseActive = () => mongoose.connection.readyState === 1;

// Helper to generate unique Mongo-like ObjectId string
const genId = () => new mongoose.Types.ObjectId().toString();

const DataStore = {
  init: async () => {
    await initMemoryStore();
    if (isMongooseActive()) {
      await seedMongoIfEmpty();
    }
  },

  // USERS
  users: {
    findByEmail: async (email, includePassword = false) => {
      if (isMongooseActive()) {
        const q = User.findOne({ email: email.toLowerCase() });
        if (includePassword) q.select('+password');
        return await q;
      }
      const found = memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) return null;
      const res = { ...found };
      if (!includePassword) delete res.password;
      return res;
    },

    findById: async (id) => {
      if (isMongooseActive()) {
        return await User.findById(id).select('-password');
      }
      const found = memUsers.find((u) => u._id.toString() === id.toString());
      if (!found) return null;
      const res = { ...found };
      delete res.password;
      return res;
    },

    create: async (userData) => {
      if (isMongooseActive()) {
        return await User.create(userData);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = {
        _id: genId(),
        ...userData,
        password: hashedPassword,
        role: userData.role || 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        matchPassword: async function (candidate) {
          return bcrypt.compare(candidate, this.password);
        },
      };
      memUsers.push(newUser);
      const returnedUser = { ...newUser };
      delete returnedUser.password;
      return returnedUser;
    },

    findAll: async () => {
      if (isMongooseActive()) {
        return await User.find({}).select('-password').sort({ createdAt: -1 });
      }
      return memUsers.map((u) => {
        const copy = { ...u };
        delete copy.password;
        return copy;
      });
    },
  },

  // PRODUCTS
  products: {
    find: async (query = {}, options = {}) => {
      if (isMongooseActive()) {
        let q = Product.find(query);
        if (options.sort) q = q.sort(options.sort);
        if (options.limit) q = q.limit(options.limit);
        return await q;
      }

      let results = [...memProducts];

      // Filtering
      if (query.modelFamily) {
        results = results.filter((p) => p.modelFamily === query.modelFamily);
      }
      if (query.chip) {
        if (Array.isArray(query.chip)) {
          results = results.filter((p) => query.chip.includes(p.chip));
        } else {
          results = results.filter((p) => p.chip === query.chip);
        }
      }
      if (query.screenSize) {
        results = results.filter((p) => p.screenSize === query.screenSize);
      }
      if (query.ram) {
        results = results.filter((p) => p.ram === query.ram);
      }
      if (query.storage) {
        results = results.filter((p) => p.storage === query.storage);
      }
      if (query.condition) {
        results = results.filter((p) => p.condition === query.condition);
      }
      if (query.featured !== undefined) {
        results = results.filter((p) => p.featured === query.featured);
      }
      if (query.minPrice !== undefined) {
        results = results.filter((p) => p.price >= Number(query.minPrice));
      }
      if (query.maxPrice !== undefined) {
        results = results.filter((p) => p.price <= Number(query.maxPrice));
      }
      if (query.search) {
        const term = query.search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.chip.toLowerCase().includes(term) ||
            p.modelFamily.toLowerCase().includes(term)
        );
      }

      // Sorting
      if (options.sort) {
        if (options.sort.price === 1) results.sort((a, b) => a.price - b.price);
        if (options.sort.price === -1) results.sort((a, b) => b.price - a.price);
        if (options.sort.createdAt === -1)
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (options.sort.rating === -1) results.sort((a, b) => b.rating - a.rating);
      }

      if (options.limit) {
        results = results.slice(0, options.limit);
      }

      return results;
    },

    findById: async (id) => {
      if (isMongooseActive()) {
        return await Product.findById(id);
      }
      return memProducts.find((p) => p._id.toString() === id.toString()) || null;
    },

    create: async (data) => {
      if (isMongooseActive()) {
        return await Product.create(data);
      }
      const newProd = {
        _id: genId(),
        ...data,
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memProducts.unshift(newProd);
      return newProd;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (isMongooseActive()) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
      }
      const idx = memProducts.findIndex((p) => p._id.toString() === id.toString());
      if (idx === -1) return null;
      memProducts[idx] = {
        ...memProducts[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return memProducts[idx];
    },

    findByIdAndDelete: async (id) => {
      if (isMongooseActive()) {
        return await Product.findByIdAndDelete(id);
      }
      const idx = memProducts.findIndex((p) => p._id.toString() === id.toString());
      if (idx === -1) return null;
      const removed = memProducts.splice(idx, 1)[0];
      return removed;
    },
  },

  // REPAIR TICKETS
  repairTickets: {
    find: async (query = {}, options = { sort: { createdAt: -1 } }) => {
      if (isMongooseActive()) {
        let q = RepairTicket.find(query);
        if (options.sort) q = q.sort(options.sort);
        return await q;
      }
      let results = [...memRepairTickets];
      if (query.status) {
        results = results.filter((t) => t.status === query.status);
      }
      if (query.user) {
        results = results.filter((t) => t.user && t.user.toString() === query.user.toString());
      }
      if (query.customerEmail) {
        results = results.filter(
          (t) => t.customerEmail.toLowerCase() === query.customerEmail.toLowerCase()
        );
      }
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    },

    findByTicketId: async (ticketId) => {
      const cleanId = ticketId.trim().toUpperCase();
      if (isMongooseActive()) {
        return await RepairTicket.findOne({ ticketId: cleanId });
      }
      return (
        memRepairTickets.find((t) => t.ticketId.toUpperCase() === cleanId) || null
      );
    },

    findById: async (id) => {
      if (isMongooseActive()) {
        return await RepairTicket.findById(id);
      }
      return memRepairTickets.find((t) => t._id.toString() === id.toString()) || null;
    },

    create: async (data) => {
      if (isMongooseActive()) {
        return await RepairTicket.create(data);
      }
      const newTicket = {
        _id: genId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memRepairTickets.unshift(newTicket);
      return newTicket;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (isMongooseActive()) {
        return await RepairTicket.findByIdAndUpdate(id, updateData, { new: true });
      }
      const idx = memRepairTickets.findIndex((t) => t._id.toString() === id.toString());
      if (idx === -1) return null;
      memRepairTickets[idx] = {
        ...memRepairTickets[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return memRepairTickets[idx];
    },

    findByIdAndDelete: async (id) => {
      if (isMongooseActive()) {
        return await RepairTicket.findByIdAndDelete(id);
      }
      const idx = memRepairTickets.findIndex((t) => t._id.toString() === id.toString());
      if (idx === -1) return null;
      return memRepairTickets.splice(idx, 1)[0];
    },
  },

  // ORDERS
  orders: {
    find: async (query = {}, options = { sort: { createdAt: -1 } }) => {
      if (isMongooseActive()) {
        let q = Order.find(query);
        if (options.sort) q = q.sort(options.sort);
        return await q;
      }
      let results = [...memOrders];
      if (query.user) {
        results = results.filter((o) => o.user && o.user.toString() === query.user.toString());
      }
      if (query.orderStatus) {
        results = results.filter((o) => o.orderStatus === query.orderStatus);
      }
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    },

    findById: async (id) => {
      if (isMongooseActive()) {
        return await Order.findById(id);
      }
      return memOrders.find((o) => o._id.toString() === id.toString()) || null;
    },

    findByOrderNumber: async (orderNumber) => {
      const cleanNum = orderNumber.trim().toUpperCase();
      if (isMongooseActive()) {
        return await Order.findOne({ orderNumber: cleanNum });
      }
      return memOrders.find((o) => o.orderNumber === cleanNum) || null;
    },

    create: async (data) => {
      if (isMongooseActive()) {
        return await Order.create(data);
      }
      const newOrder = {
        _id: genId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memOrders.unshift(newOrder);
      return newOrder;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (isMongooseActive()) {
        return await Order.findByIdAndUpdate(id, updateData, { new: true });
      }
      const idx = memOrders.findIndex((o) => o._id.toString() === id.toString());
      if (idx === -1) return null;
      memOrders[idx] = {
        ...memOrders[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return memOrders[idx];
    },
  },
};

module.exports = DataStore;
