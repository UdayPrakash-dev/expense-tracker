// backend/routes/health.routes.js
const express = require('express');
const mongoose = require('mongoose');
const healthRouter = express.Router();

const DB_STATES = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
};

healthRouter.get('/', async (req, res) => {
    const startTime = Date.now();
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;

    let dbLatency = null;
    let isDbResponsive = false;

    if (isDbConnected) {
        try {
            // Actively ping the database to verify roundtrip latency
            await mongoose.connection.db.admin().ping();
            dbLatency = `${Date.now() - startTime}ms`;
            isDbResponsive = true;
        } catch (err) {
            isDbResponsive = false;
        }
    }

    const memoryUsage = process.memoryUsage();

    const healthReport = {
        status: isDbConnected && isDbResponsive ? 'UP' : 'DOWN',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())} seconds`,
        services: {
            database: {
                status: isDbConnected && isDbResponsive ? 'Healthy' : 'Unhealthy',
                state: DB_STATES[dbState] || 'Unknown',
                latency: dbLatency || 'N/A',
            },
        },
        system: {
            nodeVersion: process.version,
            memory: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
            },
        },
    };

    // Return 200 if everything is fine, 503 if the database is down
    const httpStatus = healthReport.status === 'UP' ? 200 : 503;
    return res.status(httpStatus).json(healthReport);
});

module.exports = healthRouter;
