import express, { Application } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import { ENVVariables } from "./core/utils/EnvVariables";
import UserController from "./api/controllers/UserController";
import TransactionsController from "./api/controllers/TransactionsController";

const MinitMoneyApp: Application = express();

MinitMoneyApp.use(cors());
MinitMoneyApp.use(express.json());
MinitMoneyApp.use(cookieParser(ENVVariables.JWTSecret)); // this will basically help stick the access token into the ui cookies on the browser
MinitMoneyApp.use(express.urlencoded({ extended: true }));

// specify the ends points
MinitMoneyApp.use("/api/auth", UserController);
MinitMoneyApp.use("/api/transactions", TransactionsController);

MinitMoneyApp.listen(ENVVariables.AppPort, () => {
    console.log(ENVVariables.AppPort);
});