# Expense Tracker — Frontend

A production-ready, responsive personal finance web application built with **React 19**, **Vite**, and **Vanilla CSS**.

---

## 🚀 Features

* **JWT Authentication**: Secure user registration, login, and protected route management with token persistence in `localStorage`.
* **Centralized API Client**: Axios instance with automatic `Authorization: Bearer <token>` injection and automated 401 token expiration handling.
* **Financial Dashboard**:
  * All-time expenditure totals and transaction analytics.
  * Real-time search by merchant or category.
  * Month and Year filtering directly integrated with backend date-range queries.
  * Category spending progress and breakdown charts.
* **Expense CRUD**:
  * Create, edit, inspect, and delete expenses.
  * Quick category pills and numerical amount validations.
  * Animated delete confirmation modals.
* **Premium Dark Mode Glassmorphism**:
  * Slate & emerald color palette with backdrop blur.
  * Smooth loading skeletons and intuitive empty states.
  * Application-wide toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Custom Vanilla CSS (Design Tokens, Glassmorphism, Micro-animations) |

---

## 📂 Project Structure

```
frontend/src/
├── api/
│   ├── client.js             # Centralized Axios client with request/response interceptors
│   ├── auth.js               # signup & login endpoints
│   └── expenses.js           # Expense CRUD, totals, and monthly filter endpoints
├── context/
│   ├── AuthContext.jsx       # Global Auth state, user session, login/logout handlers
│   └── ToastContext.jsx      # Global toast notification system
├── components/
│   ├── common/
│   │   ├── Navbar.jsx        # Responsive navigation bar with user badge & logout
│   │   ├── Toast.jsx         # Toast notification container
│   │   ├── Modal.jsx         # Reusable confirmation modal dialog
│   │   ├── StatCard.jsx      # Metric summary card
│   │   ├── LoadingSkeleton.jsx # Skeleton placeholders for loading states
│   │   └── EmptyState.jsx    # Zero-data view with call-to-action
│   ├── layout/
│   │   ├── AppLayout.jsx     # Global layout wrapper
│   │   └── ProtectedRoute.jsx # Route guard redirecting to /login
│   └── expenses/
│       ├── ExpenseFilter.jsx # Search, month, year, and category controls
│       ├── ExpenseTable.jsx  # Interactive table with column sorting
│       └── ExpenseCharts.jsx # Category breakdown progress bars
├── pages/
│   ├── Login.jsx             # Sign-in page with validation
│   ├── Signup.jsx            # Registration page with auto-login
│   ├── Dashboard.jsx         # Main analytics & expense overview dashboard
│   ├── ExpenseCreate.jsx     # New expense creation form
│   ├── ExpenseEdit.jsx       # Expense editing form
│   ├── ExpenseDetails.jsx    # Dedicated expense detail inspector
│   └── NotFound.jsx          # 404 error page
├── index.css                 # Design system tokens & utility classes
├── App.jsx                   # Route provider & context assembly
└── main.jsx                  # React DOM root entry point
```

---

## ⚡ Getting Started Locally

### Prerequisites
* **Node.js**: v18 or newer
* **Backend**: The Express backend must be running on `http://localhost:3000` (or configured via Vite proxy).

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔐 How Authentication Works

1. **Sign Up / Login**: Sends credentials to `/api/auth/login` or `/api/auth/signup`.
2. **Token Storage**: On success, the JWT is stored in `localStorage` under the key `'token'`.
3. **Automatic Header Injection**: `client.js` attaches `Authorization: Bearer <token>` to every subsequent API call.
4. **Route Guarding**: `ProtectedRoute` checks `isAuthenticated`. If false, users are redirected to `/login` while preserving their target URL.
5. **Auto Logout on Expiry**: If any protected route returns `401 Unauthorized`, `client.js` clears storage and redirects to `/login`.
