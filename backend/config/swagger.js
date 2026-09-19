// backend/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expense Tracker API',
            version: '1.0.0',
            description: 'API documentation for the Expense Tracker full-stack application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from /auth/login',
                },
            },
            schemas: {
                Expense: {
                    type: 'object',
                    required: ['Category', 'Amount', 'Merchant', 'Date'],
                    properties: {
                        _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
                        userId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0a2' },
                        Category: { type: 'string', example: 'Food & Dining' },
                        Amount: { type: 'number', example: 450.50 },
                        Merchant: { type: 'string', example: 'Starbucks' },
                        Date: { type: 'string', format: 'date', example: '2026-09-18' },
                    },
                },
                User: {
                    type: 'object',
                    required: ['name', 'email', 'pass'],
                    properties: {
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        pass: { type: 'string', format: 'password', example: 'password123' },
                    },
                },
            },
        },
    },
    // Path to the API docs (routes files containing JSDoc comments)
    apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    // Mount Swagger UI on /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Optional: Expose raw JSON spec at /api-docs.json
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

module.exports = setupSwagger;
