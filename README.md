# Expense Tracker

A full-stack expense tracking application.

## Features

- Add expenses
- View all expenses
- Update expenses
- Delete expenses
- Filter expenses by month
- Calculate total expenses

## Backend

- Node.js
- Express

## Frontend

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

### 4. User Authentication & Authorization

Introduce secure user management using:

* User Registration
* User Login
* Password Hashing
* JWT-based Authentication
* Protected API Routes

This will enable each user to securely manage their own expenses.

### 5. Analytics Dashboard

Develop an analytics dashboard to provide insights into spending behavior, including:

* Monthly spending trends
* Category distribution charts
* Top merchants
* Spending patterns over time
* Budget tracking and alerts

The goal is to transform the application from a simple expense tracker into a personal finance analytics platform.
