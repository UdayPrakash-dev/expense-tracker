const express = require('express');

const expensesRouter = express.Router();

const authMiddleware = require("../middleware/auth.middleware.js");
const expensesController = require('../controller/expenses.controller.js');

expensesRouter.post('/',authMiddleware,expensesController.addExpenses);
expensesRouter.get('/getExpenses',authMiddleware,expensesController.getExpenses);
expensesRouter.get('/month/:month',authMiddleware,expensesController.getExpensesByMonth);
expensesRouter.get('/total',authMiddleware,expensesController.getTotalExpenses);
expensesRouter.get('/:expenseId',authMiddleware,expensesController.getExpenseByID);
expensesRouter.put('/:expenseId',authMiddleware,expensesController.modifyExpenseByID);
expensesRouter.delete('/:expenseId',authMiddleware,expensesController.deleteExpense);



module.exports = expensesRouter;