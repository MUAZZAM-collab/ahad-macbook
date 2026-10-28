# Ahad MacBook — Full-Stack MERN E-Commerce & Repair Service Platform

A modern, full-stack MERN application named **Ahad MacBook**, specialized in selling certified Apple MacBooks (MacBook Pro and MacBook Air with M1, M2, and M3 series chips) and providing professional board-level MacBook repair services.

Built with an Apple-inspired minimalist aesthetic, clean modular MVC architecture on the backend, and component-driven React architecture with Tailwind CSS on the frontend.

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React Icons
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Morgan
- **Database:** MongoDB / Mongoose with built-in zero-config in-memory persistence fallback for immediate eval
- **Architecture:** Monorepo with separated `client` and `server` folders

---

## 📁 Monorepo Directory Structure

```
macbook-project/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CartDrawer, ProtectedRoute
│   │   ├── context/            # AuthContext, CartContext, ThemeContext, ToastContext
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing showcase, featured products, repair teaser
│   │   │   ├── Shop.jsx        # MacBook catalog with filters (chip, size, RAM, etc.)
│   │   │   ├── ProductDetail.jsx # Gallery, technical specs table, add to bag
│   │   │   ├── RepairBooking.jsx # 4-step interactive repair booking wizard
│   │   │   ├── RepairTracker.jsx # 5-stage live repair tracker with quote approval
│   │   │   ├── EstimateCalculator.jsx # Instant pricing estimate tool
│   │   │   ├── Checkout.jsx    # Simulated payment & order confirmation
│   │   │   ├── MyOrders.jsx    # Order history with FedEx tracking numbers
│   │   │   ├── Login.jsx       # 1-click demo login for Admin & Customer
│   │   │   ├── Register.jsx    # User registration
│   │   │   └── AdminDashboard.jsx # Full CRUD Products, Repair tickets, Orders
│   │   ├── utils/              # Axios API client with auth interceptor
│   │   ├── App.jsx             # Routes & layout wrapper
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend API (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # Database connection & status
│   │   ├── controllers/        # authController, productController, repairController, orderController
│   │   ├── middleware/         # auth.js (JWT protect & admin), errorHandler.js
│   │   ├── models/             # User.js, Product.js, RepairTicket.js, Order.js
│   │   ├── routes/             # authRoutes, productRoutes, repairRoutes, orderRoutes
│   │   ├── services/           # dataStore.js (Universal MongoDB & high-performance fallback store)
│   │   ├── utils/              # seedData.js (Realistic Apple MacBooks & sample tickets)
│   │   └── index.js            # Express server entry point
│   ├── .env.example
│   ├── .env
│   ├── test-api.js             # Automated 10-step verification test suite
│   └── package.json
├── package.json                # Root package configuration
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# In project root:
npm run install-all
```
*(Or run `npm install` inside both `server/` and `client/` directories)*

### 2. Configure Environment Variables
A configured `.env` file is already provided in `server/.env`. You can customize it or review `server/.env.example`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ahad_macbook
JWT_SECRET=ahad_macbook_super_secret_jwt_key_2026_apple_certified
STRIPE_PUBLIC_KEY=pk_test_placeholder_ahad_macbook_stripe_key
STRIPE_SECRET_KEY=sk_test_placeholder_ahad_macbook_secret_key
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB:** If MongoDB is running locally or configured via MongoDB Atlas, the server connects via Mongoose natively. If MongoDB is not running locally, the server automatically enables its built-in in-memory datastore with pre-seeded data, ensuring 100% of features (CRUD, Auth, Orders, Repair Tracking) work out-of-the-box!

### 3. Run Development Servers
Open two terminal tabs:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Running on http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

---

## 🔐 Demo Credentials (Instant 1-Click Login)

The login screen (`/login`) includes 1-click evaluator buttons to automatically fill credentials:

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@ahadmacbook.com` | `admin123456` | Full CRUD on MacBooks, Repair Tickets, and Orders |
| **Customer** | `customer@example.com` | `password123` | Browsing, Purchasing, Booking Repairs, Viewing My Orders |

---

## 🏷️ Sample Repair Tracker IDs for Testing

Enter any of these codes into the **Repair Status Tracker** (`/repairs/track`) or click the demo buttons on the page:

1. **`AMB-9482`** — MacBook Pro 16" (M2 Pro), Impact screen crack. Stage: **Quote Sent** ($480). *Test customer Quote Approval/Decline action directly on this ticket!*
2. **`AMB-3821`** — MacBook Air 13" (M1), Battery Service. Stage: **Repair in Progress** ($149).
3. **`AMB-7719`** — MacBook Pro 14" (M3 Pro), Dead logic board capacitor short. Stage: **Received & Diagnosed** ($350).
4. **`AMB-1054`** — MacBook Pro 16" (M1 Max), Coffee spill water damage. Stage: **Quality Testing** ($520).

---

## 🚀 Key Features

### 1. Public E-Commerce Store (MacBook Sales)
- **Product Catalog (`/shop`):** Real-time multi-facet filters by Model Family (`MacBook Pro`, `MacBook Air`), Apple Silicon Chip (`M1`, `M2`, `M3`, `Pro`, `Max`), Screen Size (`13"`, `14"`, `15"`, `16"`), RAM (`8GB`–`64GB`), Storage (`256GB`–`2TB`), Condition (`New`, `Open Box`, `Refurbished`), and price slider.
- **Product Detail (`/product/:id`):** Interactive gallery with thumbnail selector, comprehensive Apple technical specs breakdown table (display resolution, CPU/GPU cores, ports, battery health, cycle count, warranty), stock status, and add-to-bag.
- **Shopping Cart & Checkout (`/checkout`):** Slide-over bag drawer, free expedited shipping indicator, item quantity updates, simulated secure checkout with Apple Pay / card authorization, generating unique Order numbers (`ORD-XXXXX`) and FedEx Express tracking numbers (`FEDEX-AMB-XXXXX`).

### 2. Repair Service Portal
- **Interactive Multi-Step Booking (`/repairs/book`):**
  - *Step 1:* MacBook model selection.
  - *Step 2:* Issue categorization (Screen replacement, Battery service, Logic board micro-soldering, Keyboard/Trackpad, Water damage, Other) with problem description and priority.
  - *Step 3:* Customer contact and delivery preference (In-Store Drop-off, Insured Mail-in, Courier Pickup).
  - *Step 4:* Instant estimated baseline preview, terms confirmation, and ticket generation with custom ID format `AMB-XXXX`.
- **Repair Status Tracker (`/repairs/track`):**
  - Visual 5-stage progress lifecycle:
    1. *Received & Diagnosed*
    2. *Quote Sent*
    3. *Repair in Progress*
    4. *Quality Testing*
    5. *Ready for Pickup/Shipped*
  - Shows active pulsating stage, completed checkmarks, diagnostic notes, technician assignment, and customer quote approval action.
- **Instant Estimate Calculator (`/repairs/estimate`):**
  - Interactive pricing matrix providing baseline estimates across models and repair types.
  - Breakdown of parts vs labor and 1-click transition to pre-fill the booking wizard.

### 3. Role-Based Admin Dashboard (`/admin`)
- **Protected Access:** Strictly restricted to users with `role: 'admin'`.
- **Overview & Analytics:** Real-time metrics on gross revenue, customer purchases, active repairs in queue, and total inventory count.
- **Product Management (Full CRUD):** Add new MacBook configurations, edit specs/prices/stock, delete listings with live updates.
- **Repair Ticket Management:** Advance tickets through all 5 lifecycle stages, input diagnostic technician notes, and update repair quotes.
- **Order Management:** View purchases, update shipping/fulfillment statuses (`Processing` -> `Shipped` -> `Delivered`), and manage carrier tracking numbers.

---

## 🧪 Automated Test Suite

A comprehensive end-to-end verification script is included in `server/test-api.js`:
```bash
cd server
npm test
```
Verifies all 10 endpoints: Health check, Admin login, Customer login, Filtered catalog, Product detail, Repair status lookup, Multi-step repair creation, Customer quote decision, Simulated order placement, and Admin metrics.
