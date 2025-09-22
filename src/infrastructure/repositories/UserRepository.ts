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
        return new AppResponses().successResponse(await this.prisma.session.create(sess));
    }

    async refreshAuthToken(session: Session, refreshToken: string): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const isTokenValid = jwtServices.VerifyToken(refreshToken, ENVVariables.JWTRefreshSecret);

        if (isTokenValid == "Token invalid")
            return new AppResponses().errorResponse("Invalid refresh token");

        // if we want - we can also validate against the DB token
        const user = await this.prisma.user.findUnique({ where: { id: session.userId } });

        if (!user || user.refreshToken !== refreshToken)
            return new AppResponses().errorResponse("Invalid refresh token");

        const newAccessToken = jwtServices.GenerateToken(user);
        const newRefreshToken = jwtServices.GenerateRefreshToken(user);

        // we will once again update our session with the refresh token 
        await this.prisma.user.update({
            where: { id: user.id },
            data: { token: newRefreshToken },
        });

        return new AppResponses().successResponse({ token: newAccessToken, refreshToken: newRefreshToken });

    }

    async authenticateUser(user: User): Promise<AppResponse> {
        const jwtServices = JWTHelper();
        const { decrpytPassword } = BcryptBase();

        const ifUserExists = await this.prisma.user.findFirst({
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

    async createAysnc(user: Omit<User, "id">): Promise<any> {
        // we could also add some validations here
        const { createEncryptedPassword } = BcryptBase();

        user.password = await createEncryptedPassword(user?.password as string);

        return new AppResponses().successResponse(await this.prisma.user.create(user));
    }

    async updateAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        return new AppResponses().successResponse(await this.prisma.user.update({
            where: { id: user?.id },
            data: user,
        }));
    }

    async deleteAysnc(user: User): Promise<AppResponse> {
        // we could also add some validations here
        return new AppResponses().successResponse(await this.prisma.user.delete({
            where: { id: user?.id },
        }));
    }

    async getAllAsync(): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.user.findMany());
    }

    async getAsync(id: number): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.user.findFirst({
            where: { id: id },
        }));
    }
}