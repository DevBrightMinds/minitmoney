import bcrypt from "bcrypt";
import { ENVVariables } from "../../core/utils/EnvVariables";

export const BcryptBase = () => {
    const createEncryptedPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(Number(ENVVariables.BcryptNum));
        return await bcrypt.hash(password, salt) as string;
    }

    const decrpytPassword = async (encryptedPassword: string, password: string): Promise<boolean> => {
        return await bcrypt.compare(password, encryptedPassword);
    }

    return { createEncryptedPassword, decrpytPassword };
}
