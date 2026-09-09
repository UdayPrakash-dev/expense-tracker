const express = require('express');
const app = express();
const expenses = require('../models/expense.model');

async function addExpenses(req,res){
    console.log('inside function')
    if(!req.body.Category || ! req.body.Amount || !req.body.Merchant ||!req.body.Date){
        return res.status(400).json({
            'error':'Request format improper'
        });
    }
    
    const newExpense = await expenses.create({
        'userId': req.user.id,
        'Category':req.body.Category,
        'Amount':req.body.Amount,
        'Merchant':req.body.Merchant,
        'Date':req.body.Date
    });

    return res.status(201).json(newExpense);
}

async function getExpenses(req,res){
    try{
        const expenseAll = await expenses.find({
            userId:req.user.id
        });

        return res.status(200).json(expenseAll);
    }
    catch(error){
        console.log(`Error occurred while retrieveing expenses: ${error}`);
        
        return res.status(500).json({
            error:"Internal Server Error"
        });
    }
}

async function getExpenseByID(req,res){

    try{
        const expense = await expenses.findById(req.params.expenseId);

        if(!expense){
            return res.status(404).json({
                message:"Expense not found!"
            });
        }
        return res.status(200).json(expense);
    }
    catch(error){
        return res.status(500).json({
            error:error.message
        });
    }
}

async function deleteExpense(req,res){
    try{
        const expense = await expenses.findByIdAndDelete(req.params.expenseId);
        if(!expense){
            res.status(404).json({
                message:"Expense Not Found!!"
            });
        }
        return res.status(200).json({
            message:"Expense Deleted Successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }

}

async function modifyExpenseByID(req,res){
    try{
        const expense = await expenses.findByIdAndUpdate(req.params.expenseId,
            {
                Category:req.body.Category,
                Amount :req.body.Amount,
                Merchant:req.body.Merchant,
                Date:req.body.Date,
            },
            { new: true, runValidators: true }
        );
        if(!expense){
            return res.status(404).json({
                'error':'Expense not found!'
            });
        }

        return res.status(200).json(expense);


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

async function getExpensesByMonth(req, res) {
    try {
        const month = Number(req.params.month);

        const expensesInDB = await expenses.find();

        const monthExpenses = expensesInDB.filter(
            expense => new Date(expense.Date).getMonth() + 1 === month
        );

        return res.status(200).json(monthExpenses);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

async function getTotalExpenses(req,res){

    try{
        const expenseInDb = await expenses.find();

        let sum = 0;

        for(let i=0;i<expenseInDb.length;i++){
            sum+=expenseInDb[i].Amount;
        }
        return res.status(200).json({
            Total:sum
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
    

}



module.exports = {
    addExpenses,getExpenses,deleteExpense,getExpenseByID,modifyExpenseByID,getExpensesByMonth,getTotalExpenses
}