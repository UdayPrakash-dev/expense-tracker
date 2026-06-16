const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const expensesRouter = require('./routes/expenses.routes.js');

app.use((req,res,next)=>{
    const start = Date.now();
    next();
    const end = Date.now();
    console.log(`${req.method}:${req.url},time taken:${end - start}`);
})

app.get('/',(req,res)=>{
    res.send('Hello');
});

app.use(express.json());

app.use('/expenses',expensesRouter);

app.listen(PORT,()=>{
    console.log(`started listening at port ${PORT}: ${Date.now()}`);
})

