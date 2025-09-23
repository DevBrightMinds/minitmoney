import { PrismaClient } from "../../generated/prisma";

export interface IDBContext {
    disconnect(): Promise<void>
    createDBConnection(): Promise<PrismaClient>;
}