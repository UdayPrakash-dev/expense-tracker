const express = require('express');

const authRouter = express.Router();

const authController = require("../controller/auth.controller");

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already registered
 */

authRouter.post("/signup", authController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, pass]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               pass: { type: string, format: password, example: "password123" }
 *     responses:
 *       200:
 *         description: JWT Token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       401:
 *         description: Invalid email or password
 */
authRouter.post("/login", authController.login);

module.exports = authRouter;