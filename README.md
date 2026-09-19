# Expense Tracker

A full-stack,production-grade personal finanace and  expense tracking application built with **Node.js, Express, MongoDB, React 19, and Vite**.

## Table of Contents



## Overview


## Architecture



## Features

### Core Features
- Add expenses
- View all expenses
- Update expenses
- Delete expenses
- Filter expenses by month
- Calculate total expenses
- Analyse expenses

### Production Grade Features

- User authentication
- Secure data storage
- Observability and Reliability
    - Error handling
    - Logging
    - Monitoring(Health Checks)
- Testing

## Project Structure

 backend/                                # Express.js Backend
├── server.js                              # Express app entry point
├── config/                             # Configuration files
│   ├── swagger.js                      # API documentation
│   ├── db.js                           # Database connection
│   └── logger.js                       # Winston logger configuration
├── controller/                         # Business logic controllers
│   ├── auth.controller.js              # User authentication controllers
│   └── expenses.controller.js          # Expense management controllers
├── middleware/                         # Middleware functions
│   ├── auth.middleware.js              # JWT authentication middleware
│   └── error.middleware.js           # Global error handling middleware
├── models/                             # Mongoose schemas/models
│   ├── expenses.model.js               # Expense model
│   └── user.model.js                   # User model
├── routes/                             # API routes
│   ├── auth.routes.js                  # Authentication routes
│   ├── expenses.routes.js              # Expense routes
│   └── health.routes.js                # Health routes
├── logs/                               # Application logs (created by Winston)
├── package.json                        # Backend dependencies
└── .env                                # Put all secrets here

 frontend/                               # React + Vite Frontend
├── index.html                          # HTML template entry point
├── vite.config.js                      # Vite config with /api reverse proxy
├── package.json                        # Frontend dependencies
└── src/                                # Source code
    ├── api/                            # API client & services
    │   ├── client.js                   # Axios instance with JWT interceptors
    │   ├── auth.js                     # Login & Signup API calls
    │   └── expenses.js                 # Expense CRUD, totals & filter API calls
    ├── context/                        # Global State Contexts
    │   ├── AuthContext.jsx             # User authentication & session state
    │   └── ToastContext.jsx            # Application-wide toast notifications
    ├── components/                     # Reusable React components
    │   ├── common/                     # Shared UI components
    │   │   ├── Navbar.jsx              # Responsive navigation bar
    │   │   ├── Modal.jsx               # Delete confirmation modal dialog
    │   │   ├── Toast.jsx               # Global toast alert renderer
    │   │   ├── StatCard.jsx            # Metric summary card widget
    │   │   ├── LoadingSkeleton.jsx     # Shimmer loading placeholders
    │   │   └── EmptyState.jsx          # Zero-data view with CTA
    │   ├── layout/                     # Page layout & wrappers
    │   │   ├── AppLayout.jsx           # Global layout wrapper
    │   │   └── ProtectedRoute.jsx      # Route guard redirecting to /login
    │   └── expenses/                   # Expense-specific components
    │       ├── ExpenseFilter.jsx       # Search, month, year & category toolbar
    │       ├── ExpenseTable.jsx        # Sortable interactive data table
    │       └── ExpenseCharts.jsx       # Category breakdown progress bars
    ├── pages/                          # Application view pages
    │   ├── Dashboard.jsx               # Main financial command center
    │   ├── Login.jsx                   # User sign-in page
    │   ├── Signup.jsx                  # User registration page
    │   ├── ExpenseCreate.jsx           # Add new expense page
    │   ├── ExpenseEdit.jsx             # Edit expense page
    │   ├── ExpenseDetails.jsx          # Transaction detail inspector page
    │   └── NotFound.jsx                # 404 error page
    ├── App.jsx                         # Main Router & context assembly
    ├── main.jsx                        # React root mount entry point
    └── index.css                       # Glassmorphic design system styles



## Tech Stack

### Backend

- Node.js
- Express
- MongoDB

### Frontend

- React
- Vite

## API Endpoints

- POST /expenses
- GET /expenses/getExpenses
- GET /expenses/:expenseId
- PUT /expenses/:expenseId
- DELETE /expenses/:expenseId
- GET /expenses/month/:month
- GET /expenses/total

## Running the Project


## Future Enhancements

### 1. CSV Import from Payment Applications

Allow users to upload transaction statements exported from applications such as:

* PhonePe
* Google Pay
* Paytm
* Bank account statements

The system will parse CSV files, validate transactions, and automatically import expenses into the database.

### 2. Automatic Expense Categorization

Categorize expenses into predefined groups such as:

* Food & Dining
* Transportation
* Shopping
* Entertainment
* Utilities
* Healthcare

Categories can initially be assigned using merchant-based rules and later enhanced using machine learning techniques.

### 3. Monthly Expense Reports

Generate detailed monthly reports including:

* Total spending
* Category-wise spending breakdown
* Highest expense categories
* Monthly spending trends

These reports will help users better understand and manage their finances.




The goal is to transform the application from a simple expense tracker into a personal finance analytics platform.
