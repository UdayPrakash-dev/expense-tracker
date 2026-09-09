const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const connectDB = require("./config/db");
require("dotenv").config();

const expensesRouter = require('./routes/expenses.routes.js');
const authRouter = require("./routes/auth.routes");

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const end = Date.now();
        console.log(`${req.method}:${req.url},time taken:${end - start}`);
    })
    next();

})

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use(express.json());

app.use('/auth', authRouter);

app.use('/expenses', expensesRouter);


async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is listening at port: ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
}

startServer();
