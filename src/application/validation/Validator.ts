import { Transaction, User } from "../../generated/prisma";
import { IValidator } from "../../core/interfaces/IValidator";
import { BaseRepository } from "../../infrastructure/repositories/base/BaseRepository";

export class Validator extends BaseRepository implements IValidator {

    constructor() { super() }

    async checkSpaces(value: string): Promise<boolean> {
        if (/\s/g.test(value))
            return false;

        return true;
    }

    async validateTransaction(item: Transaction): Promise<string> {
        if (!item.amount || !item.recipient || !item.currency)
            return "Missing required fields: amount, recipient, or currency";

        return "";
    }

    async checkStringLength(value: string, measure: number): Promise<boolean> {
        if (value.length < measure)
            return false;

        return true;
    }

    async validateEmail(value: string): Promise<boolean> {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))
            return true;

        return false;
    }

    async checkIfItemExists(email: string): Promise<boolean> {
        const prisma = await this.createDBConnection();

        const response: User | null = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (response !== null)
            return true;

        return false;
    }
}