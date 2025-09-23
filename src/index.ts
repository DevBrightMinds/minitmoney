import express, { Application } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { ENVVariables } from "./core/utils/EnvVariables";
import UserController from "./api/controllers/UserController";
import TransactionsController from "./api/controllers/TransactionsController";

const MinitMoneyApp: Application = express();

MinitMoneyApp.use(cors());
MinitMoneyApp.use(express.json());
MinitMoneyApp.use(cookieParser(ENVVariables.JWTSecret)); // this will basically help stick the access token into the ui cookies on the browser
MinitMoneyApp.use(express.urlencoded({ extended: true }));

// and our swagger here
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MinitMoney API',
            version: '1.0.0',
            description: 'API documentation for the MinitMoney project',
        },
        servers: [
            {
                url: `http://localhost:${ENVVariables.AppPort}`,
            },
        ],
    },
    apis: ["./src/api/controllers/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

MinitMoneyApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// specify the ends points
MinitMoneyApp.use("/api/auth", UserController);
MinitMoneyApp.use("/api/transactions", TransactionsController);

MinitMoneyApp.listen(ENVVariables.AppPort, () => {
    console.log(ENVVariables.AppPort);
});