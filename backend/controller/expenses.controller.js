const express = require('express');
const app = express();
const expenses = require('../models/expense.model');
const mongoose = require('mongoose');

function isValidAmount(amount) {
    return typeof amount === "number" && amount > 0;
}

async function addExpenses(req, res) {

    try {
        if (!req.body.Category || !req.body.Amount || !req.body.Merchant || !req.body.Date) {
            return res.status(400).json({
                'error': 'Request format improper'
            });

        }
        if (!isValidAmount(req.body.Amount)) {
            return res.status(400).json({
                'error': 'Amount must be a positive number'
            });
        }

        const newExpense = await expenses.create({
            'userId': req.user.id,
            'Category': req.body.Category,
            'Amount': req.body.Amount,
            'Merchant': req.body.Merchant,
            'Date': req.body.Date
        });

        return res.status(201).json(newExpense);

    }
    // console.log('inside function')
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error!!"
        });
    }

}

async function getExpenses(req, res) {
    try {
        const expenseAll = await expenses.find({
            userId: req.user.id
        })
            .sort({ Date: -1 });

        return res.status(200).json(expenseAll);
    }
    catch (error) {
        console.log(`Error occurred while retrieveing expenses: ${error}`);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

async function getExpenseByID(req, res) {

    try {
        const expense = await expenses.findOne({
            _id: req.params.expenseId,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found!"
            });
        }
        return res.status(200).json(expense);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error.message
        });
    }
}

async function deleteExpense(req, res) {
    try {
        const expense = await expenses.findOneAndDelete({
            _id: req.params.expenseId,
            userId: req.user.id
        });
        if (!expense) {
            return res.status(404).json({
                message: "Expense Not Found!!"
            });
        }
        return res.status(200).json({
            message: "Expense Deleted Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}

async function modifyExpenseByID(req, res) {
    try {

        if (req.body.Amount !== undefined && !isValidAmount(req.body.Amount)) {
            return res.status(400).json({
                error: "Invalid Amount"
            })
        }
        const expense = await expenses.findOneAndUpdate(
            {
                _id: req.params.expenseId,
                userId: req.user.id
            },
            {
                Category: req.body.Category,
                Amount: req.body.Amount,
                Merchant: req.body.Merchant,
                Date: req.body.Date,
            },
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({
                'error': 'Expense not found!'
            });
        }

        return res.status(200).json(expense);


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getExpensesByMonth(req, res) {
    try {
        const month = Number(req.params.month);

        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({
                error: "Month must be an integer b/w 1 and 12"
            });
        }

        //optional year in query , or we just use the current year.
        const year = Number(req.query.year) || new Date().getFullYear();

        const startDate = new Date(
            Date.UTC(year, month - 1, 1)
        );

        const endDate = new Date(
            Date.UTC(year, month, 1)
        );

        //Query combining userId, and Date range, and then sort them based on date. 
        const monthExpenses = await expenses
            .find({
                userId: req.user.id,
                Date: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
            .sort({ Date: -1 });



        return res.status(200).json(monthExpenses);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

async function getTotalExpenses(req, res) {

    try {
        const result = await expenses.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id)
                }
            },

            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$Amount" }
                }
            }
        ]);

        const total = result.length > 0 ? result[0].totalAmount : 0;

        return res.status(200).json({
            sum: total,
            Total: total
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }


}



module.exports = {
    addExpenses, getExpenses, deleteExpense, getExpenseByID, modifyExpenseByID, getExpensesByMonth, getTotalExpenses
}