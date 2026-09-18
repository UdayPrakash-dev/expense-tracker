const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const connectDB = require("./config/db");
require("dotenv").config();
const errorHandler = require('./middleware/error.middleware');

const expensesRouter = require('./routes/expenses.routes.js');
const authRouter = require("./routes/auth.routes");
const healthRouter = require('./routes/health.routes');

app.use(helmet());

app.use('/health', healthRouter);

const morganStream = {
    write: (message) => logger.http(message.trim()),
};

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream })
);

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many requests"
});

const authLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 4,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many attempts to login/signup. Try again later." }
})

// app.use((req, res, next) => {
//     const start = Date.now();

//     res.on('finish', () => {
//         const end = Date.now();
//         console.log(`${req.method}:${req.url},time taken:${end - start}`);
//     })
//     next();

// });

app.use(generalLimiter);

app.get('/', (req, res) => {
    res.send('App is running!');
});

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/auth', authLimiter, authRouter);

app.use('/expenses', expensesRouter);

app.use(errorHandler);


async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server is listening at port: ${PORT}`);
        });
    }
    catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
}

startServer();

module.exports = app;
