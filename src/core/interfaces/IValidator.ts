import { Transaction } from "../../generated/prisma";

export interface IValidator {
    checkSpaces?: (value: string) => Promise<boolean>;
    validateEmail?: (value: string) => Promise<boolean>;
    checkIfItemExists?: (email: string) => Promise<boolean>;
    validateTransaction?: (transaction: Transaction) => Promise<string>;
    checkStringLength?: (value: string, measure: number) => Promise<boolean>;
}