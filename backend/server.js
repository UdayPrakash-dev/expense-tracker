require("dotenv").config();
const express = require('express');
const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const connectDB = require("./config/db");
const setupSwagger = require('./config/swagger');
const errorHandler = require('./middleware/error.middleware');

const expensesRouter = require('./routes/expenses.routes.js');
const authRouter = require("./routes/auth.routes");
const healthRouter = require('./routes/health.routes');

setupSwagger(app);

app.use(helmet());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many attempts to login/signup. Try again later." }
});

app.use(generalLimiter);

app.get('/', (req, res) => {
    res.send('App is running!');
});

app.use(express.json());

app.use('/auth', authLimiter, authRouter);

app.use('/expenses', expensesRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use(errorHandler);


async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            logger.error("FATAL: JWT_SECRET environment variable is not defined.");
            process.exit(1);
        }

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

if (require.main === module) {
    startServer();
}

module.exports = app;
