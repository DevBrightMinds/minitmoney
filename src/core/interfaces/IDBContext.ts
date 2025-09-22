import { PrismaClient } from "@prisma/client";

export interface IDBContext {
    disconnect(): Promise<void>
    createDBConnection(): Promise<PrismaClient>;
}