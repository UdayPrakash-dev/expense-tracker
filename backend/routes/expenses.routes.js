const express = require('express');

const expensesRouter = express.Router();

const expensesController = require('../controller/expenses.controller.js');

expensesRouter.post('/',expensesController.addExpenses);
expensesRouter.get('/getExpenses',expensesController.getExpenses);
expensesRouter.get('/month/:month',expensesController.getExpensesByMonth);
expensesRouter.get('/total',expensesController.getTotalExpenses);
expensesRouter.get('/:expenseId',expensesController.getExpenseByID);
expensesRouter.put('/:expenseId',expensesController.modifyExpenseByID);
expensesRouter.delete('/:expenseId',expensesController.deleteExpense);



module.exports = expensesRouter;