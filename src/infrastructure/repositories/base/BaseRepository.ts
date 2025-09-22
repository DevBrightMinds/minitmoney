import { PrismaClient } from "@prisma/client";
import { DBContext } from "../../data/DBContext";

export class BaseRepository extends DBContext  {
    protected prisma: PrismaClient;

    constructor() {
        super();
    }

    async getDBConnection(): Promise<PrismaClient> {
        this.prisma = this.createDBConnection();
    }
}