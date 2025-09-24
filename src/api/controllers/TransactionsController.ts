import express, { Request, Response, Router } from "express";

import rateLimit from "express-rate-limit";
import { AppResponse } from "../../core/entities/AppResponse";
import { TransactionsRepository } from "../../infrastructure/repositories/TransactionsRepository";

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - userId
 *         - recipient
 *         - amount
 *         - currency
 *         - exchangeRate
 *         - fee
 *         - netAmount
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the transaction.
 *         userId:
 *           type: integer
 *           description: The ID of the user associated with the transaction.
 *         recipient:
 *           type: string
 *           description: The recipient of the transaction.
 *         amount:
 *           type: number
 *           description: The total amount involved in the transaction.
 *         currency:
 *           type: string
 *           description: The currency used in the transaction (e.g., USD, EUR).
 *         exchangeRate:
 *           type: number
 *           description: The exchange rate applied to the transaction.
 *         fee:
 *           type: number
 *           description: The transaction fee charged.
 *         netAmount:
 *           type: number
 *           description: The net amount after the fee has been deducted.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the transaction was created.
 */

/**
 * @swagger
 * /transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction in the system.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// we are to use services instead of repos - to add this later

const transactionRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,            // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute.',
});

const transactionsRepo = new TransactionsRepository();
const TransactionsController: Router = express.Router();

TransactionsController.use("/getAll", transactionRateLimiter);

TransactionsController.post("/create", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "")
        response.send(await transactionsRepo.createAysnc(request.body));
    else
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
});

/**
 * @swagger
 * /transactions/get:
 *   post:
 *     summary: Get a specific transaction
 *     description: Retrieves a transaction by ID.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */

// this could also work as get - .get("/get/:id")
TransactionsController.post("/get", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "")
        response.send(await transactionsRepo.getAsync(request.body?.id));
    else
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
});

/**
 * @swagger
 * /api/transactions/getAll:
 *   post:
 *     summary: Get all transactions with pagination and filters
 *     description: Retrieve all transactions with support for pagination and filtering based on user ID, currency, amount, and date.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Page:
 *                 type: integer
 *                 description: The page number for pagination. Defaults to 1 if not provided.
 *                 example: 1
 *               Limit:
 *                 type: integer
 *                 description: The number of transactions per page. Defaults to 10 if not provided.
 *                 example: 10
 *               Filter:
 *                 type: object
 *                 description: Filters for the transaction search.
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: Filter by user ID. Defaults to no filter if not provided.
 *                     example: 2
 *                   currency:
 *                     type: string
 *                     description: Filter by transaction currency (e.g., USD, EUR). Defaults to no filter if not provided.
 *                     example: "ZAR"
 *                   amount:
 *                     type: number
 *                     description: Filter by transaction amount. Defaults to no filter if not provided.
 *                     example: 200
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Filter by transaction date. The date should be in `YYYY-MM-DD` format. Defaults to no filter if not provided.
 *                     example: "2025-09-23"
 *     responses:
 *       200:
 *         description: List of transactions with pagination information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 100
 *                         totalPages:
 *                           type: integer
 *                           example: 10
 *       401:
 *         description: Unauthorized access. The user is not authorized to view the transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized."
 *                 responseCode:
 *                   type: integer
 *                   example: 401
 *       400:
 *         description: Bad request. The input is invalid or missing necessary parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input."
 *                 responseCode:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 responseCode:
 *                   type: integer
 *                   example: 500
 */


TransactionsController.post("/getAll", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "") {
        response.send(await transactionsRepo.getAllAsync(request.body));
    } else {
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
    }
});

const isSessionValid = async (request: Request): Promise<string> => {
    // the refresh token endpoint can be used here
    return request.headers["authorization"]?.replace("Bearer ", "") ? request.headers["authorization"]?.replace("Bearer ", "") : "";
}

export default TransactionsController
