const expenses = require('../models/expense.model');
const mongoose = require('mongoose');

function isValidAmount(amount) {
    return typeof amount === "number" && !isNaN(amount) && Number.isFinite(amount) && amount > 0 && amount <= 1000000000;
}

async function addExpenses(req, res) {

    try {
        const { Category, Amount, Merchant, Date: expenseDate } = req.body;

        if (!Category || !Amount || !Merchant || !expenseDate || !String(Category).trim() || !String(Merchant).trim()) {
            return res.status(400).json({
                'error': 'Request format improper'
            });
        }
        if (!isValidAmount(Amount)) {
            return res.status(400).json({
                'error': 'Amount must be a positive number'
            });
        }

        const parsedDate = new Date(expenseDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                'error': 'Invalid Date format'
            });
        }

        const newExpense = await expenses.create({
            'userId': req.user.id,
            'Category': String(Category).trim(),
            'Amount': Amount,
            'Merchant': String(Merchant).trim(),
            'Date': parsedDate
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
        let query = expenses.find({
            userId: req.user.id
        }).sort({ Date: -1 });

        if (req.query.limit) {
            const limit = Math.max(1, parseInt(req.query.limit, 10) || 50);
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const expenseAll = await query;

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
        if (!mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
            return res.status(400).json({
                error: "Invalid Expense ID format"
            });
        }

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
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function deleteExpense(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
            return res.status(400).json({
                error: "Invalid Expense ID format"
            });
        }

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
        if (!mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
            return res.status(400).json({
                error: "Invalid Expense ID format"
            });
        }

        const updateFields = {};
        const { Category, Amount, Merchant, Date: expenseDate } = req.body;

        if (Category !== undefined) {
            if (typeof Category !== 'string' || !Category.trim()) {
                return res.status(400).json({
                    error: "Category cannot be empty"
                });
            }
            updateFields.Category = Category.trim();
        }

        if (Amount !== undefined) {
            if (!isValidAmount(Amount)) {
                return res.status(400).json({
                    error: "Invalid Amount"
                });
            }
            updateFields.Amount = Amount;
        }

        if (Merchant !== undefined) {
            if (typeof Merchant !== 'string' || !Merchant.trim()) {
                return res.status(400).json({
                    error: "Merchant cannot be empty"
                });
            }
            updateFields.Merchant = Merchant.trim();
        }

        if (expenseDate !== undefined) {
            const parsedDate = new Date(expenseDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    error: "Invalid Date format"
                });
            }
            updateFields.Date = parsedDate;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                error: "At least one valid field (Category, Amount, Merchant, Date) must be provided for update"
            });
        }

        const expense = await expenses.findOneAndUpdate(
            {
                _id: req.params.expenseId,
                userId: req.user.id
            },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found!'
            });
        }

        return res.status(200).json(expense);
    }
    catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: error.message
            });
        }
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getExpensesByMonth(req, res) {
    try {
        const month = Number(req.params.month);

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return res.status(400).json({
                error: "Month must be an integer b/w 1 and 12"
            });
        }

        //optional year in query , or we just use the current year.
        let year = new Date().getFullYear();
        if (req.query.year !== undefined) {
            const parsedYear = Number(req.query.year);
            if (!Number.isInteger(parsedYear) || parsedYear < 1970 || parsedYear > 2100) {
                return res.status(400).json({
                    error: "Year must be an integer between 1970 and 2100"
                });
            }
            year = parsedYear;
        }

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
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

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

        const total = result.length > 0 ? Math.round(result[0].totalAmount * 100) / 100 : 0;

        return res.status(200).json({
            sum: total,
            Total: total
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }


}



module.exports = {
    addExpenses, getExpenses, deleteExpense, getExpenseByID, modifyExpenseByID, getExpensesByMonth, getTotalExpenses
}