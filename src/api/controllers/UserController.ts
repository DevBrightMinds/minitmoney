import express, { Request, Response, Router } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password (hashed).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user in the system.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */


// we are to use services instead of repos - to add this later
const userRepository = new UserRepository();
const UserController: Router = express.Router();

UserController.post("/register", async (request: Request, response: Response) => {
    response.send(await userRepository.createAysnc(request.body));
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user to the system.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

UserController.post("/login", async (request: Request, response: Response) => {
    response.send(await userRepository.authenticateUser(request.body))
});


export default UserController
