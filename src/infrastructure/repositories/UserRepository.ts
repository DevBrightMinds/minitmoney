import { PrismaClient } from "../../generated/prisma";
import { Session, User } from "../../generated/prisma";
import { BaseRepository } from "./base/BaseRepository";
import { ENVVariables } from "../../core/utils/EnvVariables";
import { AppResponse } from "../../core/entities/AppResponse";
import { JWTHelper } from "../../application/helpers/JWTHelper";
import { BcryptBase } from "../../application/helpers/BcryptHelper";
import { IUserRepository } from "../../core/interfaces/IUserRepository";
import { AppResponses } from "../../application/responses/AppResponses";

export class UserRepository extends BaseRepository implements IUserRepository {
    constructor() { super(); }

    async createSession(sess: Session): Promise<AppResponse> {
        const prisma = new PrismaClient();
        return new AppResponses().successResponse(await prisma.session.create(sess as any));
    }

    async refreshAuthToken(session: Session, refreshToken: any): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const isTokenValid = jwtServices.VerifyToken(refreshToken, ENVVariables.JWTRefreshSecret);

        if (isTokenValid == "Token invalid")
            return new AppResponses().errorResponse("Invalid refresh token");

        // if we want - we can also validate against the DB token
        const prisma = new PrismaClient();

        const user: any = await prisma.user.findUnique({ where: { id: session.userId } });

        if (!user || user.token !== refreshToken)
            return new AppResponses().errorResponse("Invalid refresh token");

        const newAccessToken = jwtServices.GenerateToken(user);
        const newRefreshToken = jwtServices.GenerateRefreshToken(user);

        // we will once again update our session with the refresh token 

        // await prisma.user.update({
        //     where: { id: user.id },
        //     data: { token: newRefreshToken },
        // });

        return new AppResponses().successResponse({ token: newAccessToken, refreshToken: newRefreshToken });

    }

    async authenticateUser(user: User): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const { decrpytPassword } = BcryptBase();

        const prisma = new PrismaClient();

        const ifUserExists: any = await prisma.user.findFirst({
            where: { email: user.email },
        });

        const isPasswordValid: boolean = await decrpytPassword((ifUserExists.password), user.password);

        if (!isPasswordValid)
            return new AppResponses().errorResponse("Invalid credentials");

        const token: string = jwtServices.GenerateToken(ifUserExists);
        const refreshToken: string = jwtServices.GenerateRefreshToken(ifUserExists);

        await this.createSession({ userId: ifUserExists.id, token: token } as Session);

        return new AppResponses().successResponse({ token, refreshToken });

    }

    async createAysnc(user: Omit<User, "id">): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = await this.createDBConnection();

        const { createEncryptedPassword } = BcryptBase();

        user.password = await createEncryptedPassword(user?.password as string);

        const response = await prisma.user.create({
            data: user
        });

        return new AppResponses().successResponse(response);
    }

    async updateAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = await this.createDBConnection();

        return new AppResponses().successResponse(await prisma.user.update({
            where: { id: user?.id },
            data: user,
        }));
    }

    async deleteAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = new PrismaClient();

        return new AppResponses().successResponse(await prisma.user.delete({
            where: { id: user?.id },
        }));
    }

    async getAllAsync(): Promise<AppResponse> {
        const prisma = new PrismaClient();
        return new AppResponses().successResponse(await prisma.user.findMany());
    }

    async getAsync(id: number): Promise<AppResponse> {
        const prisma = new PrismaClient();
        return new AppResponses().successResponse(await prisma.user.findFirst({
            where: { id: id },
        }) as any);
    }
}