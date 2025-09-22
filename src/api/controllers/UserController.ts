import express, { Request, Response, Router } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

// we are to use services instead of repos - to add this later
const userRepository = new UserRepository();
const UserController: Router = express.Router();

UserController.post("/register", async (request: Request, response: Response) => {
    response.send(await userRepository.createAysnc(request.body));
});

UserController.post("/login", async (request: Request, response: Response) => {
    response.send(await userRepository.authenticateUser(request.body))
});


export default UserController
