import { PrismaClient } from "@prisma/client";
import { IDBContext } from "../../core/interfaces/IDBContext";

export class DBContext implements IDBContext {
    private static instance: PrismaClient;

    constructor() { }

    async disconnect(): Promise<void> {
        if (DBContext.instance)
            await DBContext.instance.$disconnect();
    }

    async createDBConnection(): Promise<PrismaClient> {
        if (!DBContext.instance)
            DBContext.instance = new PrismaClient();

        return DBContext.instance;
    }
}