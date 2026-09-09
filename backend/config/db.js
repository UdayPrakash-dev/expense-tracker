const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/expense_tracker');
        console.log("MongoDB connected");
    }
    catch (error){
        console.log(`MongoDB Connection Error:${error}`);
        process.exit(1);

    }
}

module.exports = connectDB;