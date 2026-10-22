const request = require('supertest');
const app = require('../server.js');

describe('GET /expenses/getExpenses', () => {
    test('It should respond with 401 without auth token', async () => {
        const response = await request(app).get('/expenses/getExpenses');
        expect(response.statusCode).toBe(401);
    });
});

describe('GET /expenses', () => {
    test('It should respond with 401 without auth token on canonical route', async () => {
        const response = await request(app).get('/expenses');
        expect(response.statusCode).toBe(401);
    });
});

describe('POST /expenses', () => {
    test('It should respond with 401 without auth token', async () => {
        const response = await request(app).post('/expenses').send({
            Category: 'Food',
            Amount: 100,
            Merchant: 'Starbucks',
            Date: '2026-09-18'
        });
        expect(response.statusCode).toBe(401);
    });
});

describe('GET /health', () => {
    test('It should respond with health status', async () => {
        const response = await request(app).get('/health');
        expect([200, 503]).toContain(response.statusCode);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('services');
    });
});