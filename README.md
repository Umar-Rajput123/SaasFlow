# SaaSFlow — SaaS Project Management Platform

A modern, production-grade SaaS Project Management Platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed for developer portfolios and production benchmarks, featuring robust role & ownership authorization, backend-enforced subscription tier limits, dynamic analytics dashboards, and responsive UI.

---

## 🌟 Key Features

### 1. User Authentication & Security
- **JWT-Based Authentication**: Secure stateless authentication using JSON Web Tokens with `Bearer` authorization headers.
- **Password Security**: Strong hashing with `bcryptjs` and salt rounds.
- **Ownership-Based Authorization**: Users can strictly view, edit, or delete **only** projects they own. Cross-account access attempts are blocked with `403 Forbidden`.
- **Persistent Sessions**: Automatic token hydration on browser refresh with automated 401 interceptor redirection on expiration.
- **Account Management**: Update user profile, display name, and securely update passwords.

### 2. Project Lifecycle & Management
- **Full CRUD Operations**: Create, Read, Update, and Delete projects with validation.
- **Agile Status Tracking**: Toggle between `Planning`, `In Progress`, and `Completed` with instant lifecycle workflow buttons.
- **Priority Engine**: Classify tasks as `Low`, `Medium`, or `High` priority with distinctive badges.
- **Deadline Tracking**: Set start dates and target due dates with dynamic countdown labels (*"Due Today"*, *"3 days remaining"*, *"Overdue by 2 days"*).
- **Search & Filtering**: Real-time keyword search across titles and descriptions, filter by status and priority, and multi-field sorting (Date, Due Date, Title, Priority).
- **Dual Display Modes**: Toggle seamlessly between responsive **Card Grid View** and **Compact Table View**.

### 3. Backend-Enforced Subscription Tiers
- **Free Plan**:
  - Maximum **3 projects** strictly enforced at the database layer.
  - Basic project management & personal dashboard.
  - Direct alert banners and upgrade prompts upon reaching the 3-project cap.
  - Any backend attempt to bypass the frontend and create a 4th project returns `403 Forbidden` with `limitReached: true`.
- **Pro Plan**:
  - **Unlimited projects** and workspaces.
  - Advanced KPI dashboard analytics and completion rate indicators.
  - Priority support and deadline tracking.
- **Simulated Payment / Upgrade Flow**:
  - Instant one-click simulated upgrade to Pro tier (ready for Stripe / LemonSqueezy webhook integration).
  - Ability to toggle back to the Free plan at any time to demonstrate limit enforcement during code reviews and interviews.

### 4. Modern Dashboard & UI/UX
- **Aggregated Metrics**: Total Projects, In Progress, Completed, Completion Rate %, and Remaining Project Slots (`Unlimited` for Pro, or `X of 3` for Free).
- **Recent Projects Feed**: Fast access to recently updated tasks.
- **Design System**: Tailored with an indigo, slate, and crisp white palette, smooth hover transitions, skeleton loading states, and custom confirmation modals.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM v7, Tailwind CSS, Axios, React Icons, Context API |
| **Backend** | Node.js, Express.js v5, MongoDB, Mongoose v9, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator`, `cors`, `morgan`, `dotenv` |
| **Testing** | Automated self-contained Node test suite with 21 passing test cases |

---

## 📁 Project Architecture

```
SaasFlow/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & connection resilience
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile & credentials
│   │   ├── projectController.js  # Project CRUD, limits & ownership checks
│   │   ├── subscriptionController.js # Plan status & simulated upgrade
│   │   └── dashboardController.js# Aggregated analytics & stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & user attachment
│   │   ├── validate.js           # Express-validator error handler
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hooks & toJSON sanitization
│   │   └── Project.js            # Project schema with compound indexes
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── projectRoutes.js      # /api/projects routes
│   │   ├── subscriptionRoutes.js # /api/subscription routes
│   │   └── dashboardRoutes.js    # /api/dashboard routes
│   ├── utils/
│   │   ├── constants.js          # Plan limits & definitions
│   │   └── generateToken.js      # JWT signing utility
│   ├── server.js                 # Express server bootstrap
│   ├── test-suite.js             # Automated 21-case test runner
│   ├── .env                      # Environment config (gitignored)
│   ├── .env.example              # Example environment template
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badge.jsx         # Status, Priority, and Plan badges
│   │   │   ├── Modal.jsx         # Accessible reusable modal dialog
│   │   │   ├── Navbar.jsx        # Top navigation with user dropdown & search
│   │   │   ├── Sidebar.jsx       # SaaS collapsible sidebar & usage progress
│   │   │   ├── SkeletonLoader.jsx# Animated loading skeletons
│   │   │   ├── Toast.jsx         # Notification alerts
│   │   │   └── UpgradeModal.jsx  # Interactive upgrade modal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & session manager
│   │   │   └── ProjectContext.jsx# Projects, stats, subscriptions & toasts
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx     # Master authenticated shell layout
│   │   │   └── ProtectedRoute.jsx# Auth route guards (Protected & Public)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Modern marketing hero & pricing page
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo evaluation mode
│   │   │   ├── RegisterPage.jsx  # User signup with validation
│   │   │   ├── DashboardPage.jsx # KPI analytics & recent projects
│   │   │   ├── ProjectsPage.jsx  # Search, filter, sort & grid/table views
│   │   │   ├── CreateProjectPage.jsx # New project form with limit check
│   │   │   ├── EditProjectPage.jsx   # Pre-populated project edit form
│   │   │   ├── ProjectDetailPage.jsx # Project overview & lifecycle changer
│   │   │   ├── SubscriptionPage.jsx  # Plan comparison & simulated checkout
│   │   │   ├── ProfilePage.jsx   # Account details & password change
│   │   │   └── NotFoundPage.jsx  # 404 handler
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Application routes
│   │   ├── index.css             # Tailwind CSS & scrollbars
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json                  # Root npm scripts
├── .gitignore
└── README.md
```

---

## 🚀 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register user (name, email, password) | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Private |
| `PUT` | `/api/auth/profile` | Update profile name or password | Private |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/projects` | Create a project (enforces Free vs Pro limits) | Private |
| `GET` | `/api/projects` | List projects (supports `search`, `status`, `priority`, `sortBy`, `order`) | Private |
| `GET` | `/api/projects/:id` | Get project details (strict ownership check) | Private |
| `PUT` | `/api/projects/:id` | Update project details (strict ownership check) | Private |
| `DELETE` | `/api/projects/:id` | Delete project (strict ownership check) | Private |

### Subscription (`/api/subscription`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/subscription` | Current plan, active slots, and features | Private |
| `POST` | `/api/subscription/upgrade`| Simulated plan change (`"pro"` or `"free"`) | Private |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Aggregated project totals, completion rate & recent items | Private |

---

## ⚙️ Local Setup and Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **MongoDB** running locally on port 27017 or a **MongoDB Atlas URI**

### 1. Clone & Install Dependencies

#### Install Backend:
```bash
cd backend
npm install
```

#### Install Frontend:
```bash
cd ../frontend
npm install
```

### 2. Environment Variables Configuration

#### Backend `.env` (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/saasflow
JWT_SECRET=saasflow_jwt_secret_key_change_in_production_portfolio_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend `.env` (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Backend Automated Test Suite
Verify database models, limit enforcement, and authorization security:
```bash
cd backend
node test-suite.js
```
*Expected output: `21 PASSED, 0 FAILED`*

### 4. Start the Application

#### Start Backend Server:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend Client (in a separate terminal):
```bash
cd frontend
npm run dev
# Client runs on http://localhost:5173
```

Now open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing the Core Features

1. **Quick Evaluation Login**:
   - Go to [http://localhost:5173/login](http://localhost:5173/login).
   - Click **"1-Click Demo Login"** to immediately sign into a preconfigured demo account.
2. **Test 3-Project Limit Enforcement**:
   - As a Free user, create 3 projects from the Dashboard or Projects page.
   - On the 3rd project, notice the remaining slots indicator shows `0 of 3 Allowed`.
   - Attempt to create a 4th project: the client shows an upgrade warning and the backend rejects unauthorized creation with `403 Forbidden`.
3. **Test Simulated Upgrade**:
   - Click **"Upgrade to Pro"** on the sidebar or subscription page.
   - Click **"Confirm Upgrade to Pro"** in the modal.
   - Notice the workspace immediately updates to **PRO PLAN**, project slots become **Unlimited**, and you can now create projects without restriction.
   - You can switch back to Free anytime on the Subscription page to re-test limits!
4. **Test Ownership Security**:
   - Register a second user in an Incognito window.
   - Inspect their project list: they will see only their own projects. Direct navigation to another user's project ID responds with `403 Access Denied`.

---

## 📜 License
This project is open-source and licensed under the [MIT License](LICENSE).
