const express = require('express');
const expensesRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const expensesController = require('../controller/expenses.controller.js');

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     description: Adds a new expense entry for the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Category, Amount, Merchant, Date]
 *             properties:
 *               Category:
 *                 type: string
 *                 example: Food & Dining
 *               Amount:
 *                 type: number
 *                 example: 350.00
 *               Merchant:
 *                 type: string
 *                 example: Starbucks
 *               Date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-18"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Invalid or missing fields / negative amount
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */
expensesRouter.post('/', authMiddleware, expensesController.addExpenses);

/**
 * @openapi
 * /expenses/getExpenses:
 *   get:
 *     summary: Get all expenses
 *     description: Retrieves all expenses belonging to the authenticated user, sorted latest first.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 */
expensesRouter.get('/getExpenses', authMiddleware, expensesController.getExpenses);

/**
 * @openapi
 * /expenses/total:
 *   get:
 *     summary: Get total expenditure
 *     description: Computes the aggregated sum total of all expenses for the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total sum calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 *                   example: 12500.50
 *                 Total:
 *                   type: number
 *                   example: 12500.50
 *       401:
 *         description: Unauthorized
 */
expensesRouter.get('/total', authMiddleware, expensesController.getTotalExpenses);

/**
 * @openapi
 * /expenses/month/{month}:
 *   get:
 *     summary: Get expenses by month
 *     description: Retrieves expenses filtered by a specific month and optional year.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1 for Jan, 12 for Dec)
 *         example: 9
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Optional 4-digit year (defaults to current year)
 *         example: 2026
 *     responses:
 *       200:
 *         description: List of filtered expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Month must be an integer between 1 and 12
 *       401:
 *         description: Unauthorized
 */
expensesRouter.get('/month/:month', authMiddleware, expensesController.getExpensesByMonth);

/**
 * @openapi
 * /expenses/{expenseId}:
 *   get:
 *     summary: Get expense by ID
 *     description: Retrieves details of a specific expense if it belongs to the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB document _id
 *         example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Expense found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 * 
 *   put:
 *     summary: Update an expense
 *     description: Modifies an existing expense belonging to the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB document _id
 *         example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Category:
 *                 type: string
 *                 example: Shopping
 *               Amount:
 *                 type: number
 *                 example: 999.00
 *               Merchant:
 *                 type: string
 *                 example: Amazon
 *               Date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-18"
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 * 
 *   delete:
 *     summary: Delete an expense
 *     description: Permanently removes an expense belonging to the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB document _id
 *         example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense Deleted Successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
expensesRouter.get('/:expenseId', authMiddleware, expensesController.getExpenseByID);
expensesRouter.put('/:expenseId', authMiddleware, expensesController.modifyExpenseByID);
expensesRouter.delete('/:expenseId', authMiddleware, expensesController.deleteExpense);

module.exports = expensesRouter;
