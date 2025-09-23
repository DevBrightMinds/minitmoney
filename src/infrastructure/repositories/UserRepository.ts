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

        return new AppResponses().successResponse(response);
    }

    async refreshAuthToken(session: Session, refreshToken: any): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const prisma = new PrismaClient();
        const isTokenValid = jwtServices.VerifyToken(refreshToken, ENVVariables.JWTRefreshSecret);

        if (isTokenValid == "Token invalid")
            return new AppResponses().errorResponse("Invalid refresh token");

        // if we want - we can also validate against the DB token

        const user = await prisma.session.findUnique({ where: { id: session.userId } });

        if (!user || user.token !== refreshToken)
            return new AppResponses().errorResponse("Invalid refresh token");

        const newAccessToken = jwtServices.GenerateToken({ id: user?.userId } as User);
        const newRefreshToken = jwtServices.GenerateRefreshToken({ id: user?.userId } as User);

        // we will once again update our session with the refresh token

        await prisma.session.update({
            where: { id: user.id },
            data: { token: newRefreshToken },
        });

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

        const response = await prisma.user.findFirst({
            where: { id: id },
        });

        return new AppResponses().successResponse(response as User);
    }
}