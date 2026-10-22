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
        trim: true
    },
    Amount:{
        type:Number,
        required:true,
        min: [0.01, 'Amount must be greater than 0']
    },
    Merchant:{
        type:String,
        required:true,
        trim: true
    },
    Date:{
        type:Date,
        required:true
    },
}, { timestamps: true });

expenseSchema.index({ userId: 1, Date: -1 });

module.exports = mongoose.model('Expense',expenseSchema);