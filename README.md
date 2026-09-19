# Expense Tracker v1.0.0

A full-stack, production-grade personal finance and  expense tracking application built with **Node.js, Express, MongoDB, React 19, and Vite**.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Request Flow](#request-flow)
- [Features](#features)
  - [Core Features](#core-features)
  - [Production Features](#production-features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Running the Project](#running-the-project)
  - [Setting up `.env`](#setting-up-the-env-file)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Swagger API](#swagger-api)
- [Future Enhancements](#future-enhancements)
  - [CSV Import](#1-csv-import-from-payment-applications)
  - [Monthly Expense Reports](#2-monthly-expense-reports)



## Overview

Expense Tracker is a full-stack personal finance application for managing and analysing personal expenses.

The application uses a React frontend for the user interface and an Express.js backend that provides REST APIs for authentication and expense management. MongoDB is used for persistent data storage.

Users can create, view, update, delete, filter, and analyse their expenses. Authentication is handled using JWT, while Winston provides application logging and Swagger provides interactive API documentation.

---

## Architecture

The application follows a **client-server architecture** consisting of a React frontend, Express.js backend, and MongoDB database.

```text
                         Client
                           │
                           ▼
                  React + Vite Frontend
                           │
                     HTTP / REST API
                           │
                           ▼
                  Express.js Backend
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
        Rate Limiter   Auth Middleware  Routes
              │            │            |
              └────────────┤────────────┘
                           ▼
                     Controllers
                           │
                           ▼
                       Mongoose
                           │
                           ▼
                        MongoDB

              ┌─────────────────────────┐
              │ Centralized Error       │
              │ Handling Middleware     │
              ├─────────────────────────┤
              │ Logging Middleware      │
              │ Winston Logger          │
              ├─────────────────────────┤
              │ Health Check Endpoint   │
              └─────────────────────────┘
```

### Request Flow

1. The user interacts with the React frontend.
2. The frontend sends REST API requests to the Express backend.
3. Rate limiting controls incoming requests.
4. Authentication middleware validates JWT-protected requests.
5. Controllers handle the application logic.
6. Mongoose communicates with MongoDB.
7. The response is returned to the frontend.
8. Logging middleware records application activity.
9. Centralized error handling provides consistent error responses.
10. The health check endpoint provides basic service health information.
11. Swagger provides interactive API documentation and testing.

---



## Features

### Core Features
- Add expenses
- View all expenses
- Update expenses
- Delete expenses
- Filter expenses by month
- Calculate total expenses
- Analyse expenses

### Production Features

- User authentication with JWT
- Centralised Error handling
- Logging with Winston
- Health Checks
- Rate Limiting



## Project Structure

```text
 backend/                                # Express.js Backend
├── server.js                           # Express app entry point
├── config/                             # Configuration files
│   ├── swagger.js                      # API documentation
│   ├── db.js                           # Database connection
│   └── logger.js                       # Winston logger configuration
├── controller/                         # Business logic controllers
│   ├── auth.controller.js              # User authentication controllers
│   └── expenses.controller.js          # Expense management controllers
├── middleware/                         # Middleware functions
│   ├── auth.middleware.js              # JWT authentication middleware
│   └── error.middleware.js             # Global error handling middleware
├── models/                             # Mongoose schemas/models
│   ├── expenses.model.js               # Expense model
│   └── user.model.js                   # User model
├── routes/                             # API routes
│   ├── auth.routes.js                  # Authentication routes
│   ├── expenses.routes.js              # Expense routes
│   └── health.routes.js                # Health routes
├── logs/                               # Application logs (created by Winston)
├── package.json                        # Backend dependencies
├── .env(needs to be created)           # Put all secrets here
└── .env.example                        # template to create a .env file

```

```text
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
```


## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- JWT
- Winston
- Swagger

### Frontend

- React
- Vite

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses` | Create an expense |
| GET | `/expenses/getExpenses` | Get all expenses |
| GET | `/expenses/:expenseId` | Get an expense by ID |
| PUT | `/expenses/:expenseId` | Update an expense |
| DELETE | `/expenses/:expenseId` | Delete an expense |
| GET | `/expenses/month/:month` | Get expenses by month |
| GET | `/expenses/total` | Get total expenses |

## Running the Project

### Setting up `.env` file

Create a `.env` file inside the `backend/` directory:

```env
PORT=PORT_NUMBER
JWT_SECRET=your_long_secret_string
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder values with your actual configuration.

> **Note:** Do not commit the `.env` file to GitHub. Add `.env` to `.gitignore`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Swagger API
After running the backend visit:
'http://localhost:PORT/api-docs'


## Future Enhancements

### 1. CSV Import from Payment Applications

Allow users to upload transaction statements exported from applications such as:

* PhonePe
* Google Pay
* Paytm
* Bank account statements

The system will parse CSV files, validate transactions, and automatically import expenses into the database.

### 2. Monthly Expense Reports

Generate detailed monthly reports including:

* Total spending
* Category-wise spending breakdown
* Highest expense categories
* Monthly spending trends

These reports will help users better understand and manage their finances.

---

The goal is to transform the application from a simple expense tracker into a personal finance analytics platform.
