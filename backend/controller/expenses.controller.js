const express = require('express');
const app = express();
const expenses = require('../data/expenses.js');

function addExpenses(req,res){
    console.log('inside function')
    if(!req.body.Category || ! req.body.Amount || !req.body.Merchant ||!req.body.Date){
        return res.status(400).json({
            'error':'Request format improper'
        });
    }
    const maxId = expenses.length
        ? Math.max(...expenses.map(expense => expense.id))
        : -1;
    const id = maxId + 1;
    const newExpense = {
        'id':id,
        'Category':req.body.Category,
        'Amount':req.body.Amount,
        'Merchant':req.body.Merchant,
        'Date':req.body.Date
    };
    expenses.push(newExpense);

    return res.status(201).json(newExpense);
}

function getExpenses(req,res){
    return res.status(200).json(expenses);
}

function getExpenseByID(req,res){
    const id = Number(req.params.expenseId);
    console.log(id);

    const expense = expenses.find(
        expense => expense.id === id
    );
    
    if(!expense){
        return res.status(404).json({
            'error':'NOT FOUND!'
        });
    }
    return res.status(200).json(expense);
}

function deleteExpense(req,res){
    const id = Number(req.params.expenseId);

    const index = expenses.findIndex(
        expense => expense.id ===id
    );
    if(index === -1){
        return res.status(404).json({
            'error':'Expense not found'
        });
    }
    expenses.splice(index,1);
    return res.status(200).json({
        'message':"Expense deleted successfully"
    });


}

function modifyExpenseByID(req,res){
    const id = Number(req.params.expenseId);

    const expense = expenses.find(
        expense => expense.id === id
    );

    if(!expense){
        return res.status(404).json({
            'error':'Expense not found!'
        });
    }

    expense.Category = req.body.Category;
    expense.Amount = req.body.Amount;
    expense.Merchant = req.body.Merchant;
    expense.Date = req.body.Date;

    return res.status(200).json(expense);
}

function getExpensesByMonth(req,res){
    const month = Number(req.params.month);

    const monthExpenses = expenses.filter(
        expense => {
            const expenseMonth = new Date(expense.Date).getMonth() +1;

            return expenseMonth === month;
        }
    )

    return res.status(200).json(monthExpenses);
}

function getTotalExpenses(req,res){
    console.log('here');
    let sum = 0;

    for(let i=0;i<expenses.length;i++){
        sum+=expenses[i].Amount;
    }
    return res.status(200).json({
        sum
    });
}



module.exports = {
    addExpenses,getExpenses,deleteExpense,getExpenseByID,modifyExpenseByID,getExpensesByMonth,getTotalExpenses
}