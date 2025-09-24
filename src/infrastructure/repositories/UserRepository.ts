import { PrismaClient } from "../../generated/prisma";
import { Session, User } from "../../generated/prisma";
import { BaseRepository } from "./base/BaseRepository";
import { ENVVariables } from "../../core/utils/EnvVariables";
import { AppResponse } from "../../core/entities/AppResponse";
import { JWTHelper } from "../../application/helpers/JWTHelper";
import { Validator } from "../../application/validation/Validator";
import { BcryptBase } from "../../application/helpers/BcryptHelper";
import { IUserRepository } from "../../core/interfaces/IUserRepository";
import { AppResponses } from "../../application/responses/AppResponses";

export class UserRepository extends BaseRepository implements IUserRepository {
    public Validations: Validator | undefined;

    constructor() {
        super();
        this.Validations = new Validator();
    }

    async createSession(sess: Session): Promise<AppResponse> {
        const prisma = new PrismaClient();

        const response = await prisma.session.create({
            data: sess
        });

        await this.disconnect();

        return new AppResponses().successResponse(response);
    }

    async refreshAuthToken(session: Session, token: string): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const prisma = new PrismaClient();
        const isTokenValid = jwtServices.VerifyToken(token, ENVVariables.JWTSecret);

        if (isTokenValid == "Token invalid")
            return new AppResponses().errorResponse("Invalid refresh token");

        // if we want - we can also validate against the DB token

        const sessions = await prisma.session.findMany({ where: { userId: session.userId } });

        const isSession = sessions.find((item: Session) => {
            return (item?.token == token);
        });

        if (!isSession)
            return new AppResponses().errorResponse("Invalid refresh token");

        const newAccessToken = jwtServices.GenerateToken({ id: isSession?.userId } as User);
        const newRefreshToken = jwtServices.GenerateRefreshToken({ id: isSession?.userId } as User);

        // we will once again update our session with the refresh token

        await prisma.session.update({
            where: { id: isSession.id },
            data: { token: newRefreshToken },
        });

        await this.disconnect();

        return new AppResponses().successResponse({ token: newAccessToken, refreshToken: newRefreshToken });

    }

    async authenticateUser(user: User): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const { decrpytPassword } = BcryptBase();

        const prisma = new PrismaClient();

        const ifUserExists = await prisma.user.findFirst({
            where: { email: user.email },
        });

        if (!ifUserExists)
            return new AppResponses().errorResponse("Invalid credentials");

        const isPasswordValid: boolean = await decrpytPassword((ifUserExists.password), user.password);

        if (!isPasswordValid)
            return new AppResponses().errorResponse("Invalid credentials");

        const token: string = jwtServices.GenerateToken(ifUserExists);
        const refreshToken: string = jwtServices.GenerateRefreshToken(ifUserExists);

        await this.createSession({ userId: ifUserExists.id, token: token } as Session);

        await this.disconnect();

        return new AppResponses().successResponse({ token, refreshToken });

    }

    async createAysnc(user: Omit<User, "id" | "createdAt">): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = await this.createDBConnection();

        const { createEncryptedPassword } = BcryptBase();

        const emailExists = await this.Validations?.checkIfItemExists(user?.email);
        const spacesInPassword = await this.Validations?.checkSpaces(user?.password);
        const passwordLength = await this.Validations?.checkStringLength(user?.password, 6);

        if (emailExists)
            return new AppResponses().successResponse(`That email address '${user?.email}' has already been taken.`);

        if (!passwordLength)
            return new AppResponses().successResponse(`Your password should atleast be 6 characters long.`);

        if (!spacesInPassword)
            return new AppResponses().successResponse(`Your password should not contain any spaces.`);

        user.password = await createEncryptedPassword(user?.password as string);

        const response = await prisma.user.create({
            data: user
        });

        await this.disconnect();

        return new AppResponses().successResponse(response);
    }

    async updateAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = await this.createDBConnection();

        const response = await prisma.user.update({
            where: { id: user?.id },
            data: user,
        });

        await this.disconnect();

        return new AppResponses().successResponse(response);
    }

    async deleteAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        const prisma = new PrismaClient();

        const response = await prisma.user.delete({
            where: { id: user?.id },
        });

        await this.disconnect();

        return new AppResponses().successResponse(response);

    }

    async getAllAsync(): Promise<AppResponse> {
        const prisma = new PrismaClient();

        const response = await prisma.user.findMany();

        await this.disconnect();

        return new AppResponses().successResponse(response);
    }

    async getAsync(id: number): Promise<AppResponse> {
        const prisma = new PrismaClient();

        const response = await prisma.user.findFirst({
            where: { id: id },
        });

        await this.disconnect();

        return new AppResponses().successResponse(response as User);
    }
}