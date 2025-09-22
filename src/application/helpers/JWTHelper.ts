import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma";
import { ENVVariables } from "../../core/utils/EnvVariables";

export const JWTHelper = () => {
    const GenerateToken = (User: User): string => {
        const token = jwt.sign({ id: User.id }, ENVVariables.JWTSecret, { expiresIn: "15m", algorithm: "HS256" });
        return token;
    }

    const GenerateRefreshToken = (user: User): string => {
        return jwt.sign(
            { id: user.id },
            ENVVariables.JWTRefreshSecret,
            { expiresIn: "15m", algorithm: "HS256" }
        );
    };


    const VerifyToken = (token: string, secret: string): string => {
        let results: User | string | any;

        try {
            jwt.verify(token, secret);
            results = jwt.decode(token);
        } catch (error: any) {
            results = "Token invalid"
        }

        return results;
    }

    return { GenerateToken, VerifyToken, GenerateRefreshToken };

}