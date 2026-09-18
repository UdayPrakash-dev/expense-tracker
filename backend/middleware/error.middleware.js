const logger = require('../config/logger.js');

//anything with (err,req,res,next is an error-handling middleware

function errorHandler(err, req, res, next) {
    logger.error(`Error:${err.message} for ${req.method}:${req.originalUrl} - IP:${req.ip}`, {
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query
    });

    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    return res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
}

module.exports = errorHandler;
