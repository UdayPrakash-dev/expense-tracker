const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Category:{
        type:String,
        required:true,
    },
    Amount:{
        type:Number,
        required:true
    },
    Merchant:{
        type:String,
        required:true,
    },
    Date:{
        type:Date,
        required:true
    },
});

module.exports = mongoose.model('Expense',expenseSchema);