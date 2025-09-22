import { Session, User } from "../../generated/prisma";
import { AppResponse } from "../entities/AppResponse";

export interface IUserRepository {
    getAllAsync(): Promise<AppResponse>;
    getAsync(id: number): Promise<AppResponse>;
    createAysnc(user: User): Promise<AppResponse>;
    updateAysnc(user: User): Promise<AppResponse>;
    deleteAysnc(user: User): Promise<AppResponse>;
    createSession(sess: Session): Promise<AppResponse>;
    authenticateUser(user: User): Promise<AppResponse>;
    refreshAuthToken(sess: Session, refreshToken: string): Promise<AppResponse>;
}