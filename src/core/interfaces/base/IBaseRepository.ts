import { PrismaClient } from "@prisma/client";

export interface IBaseRepository {
    getDBConnection(): Promise<PrismaClient>;
}