import express, { Request, Response, Router } from "express";
import { AppResponse } from "../../core/entities/AppResponse";
import { TransactionsRepository } from "../../infrastructure/repositories/TransactionsRepository";

// we are to use services instead of repos - to add this later
const transactionsRepo = new TransactionsRepository();
const TransactionsController: Router = express.Router();

TransactionsController.post("/create", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "")
        response.send(await transactionsRepo.createAysnc(request.body));
    else
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
});

// this could also work as get - .get("/get:/id")
TransactionsController.post("/get", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "")
        response.send(await transactionsRepo.getAsync(request.body?.id));
    else
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
});

TransactionsController.post("/getAll", async (request: Request, response: Response) => {
    const isAuthorized = await isSessionValid(request);

    if (isAuthorized !== "")
        response.send(await transactionsRepo.getAllAsync(request.body));
    else
        response.send({ status: false, message: "Unauthorized.", responseCode: 401, data: {} } as AppResponse);
});

const isSessionValid = async (request: Request): Promise<string> => {
    return request.headers["authorization"]?.replace("Bearer ", "") ? request.headers["authorization"]?.replace("Bearer ", "") : "";
}

export default TransactionsController
