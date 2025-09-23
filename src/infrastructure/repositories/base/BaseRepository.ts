import { DBContext } from "../../data/DBContext";
import { PrismaClient } from "../../../generated/prisma";

export class BaseRepository extends DBContext  {
    protected prisma: PrismaClient | undefined;

    constructor() {
        super();
    }

    async getDBConnection(): Promise<void> {
        this.prisma = await this.createDBConnection();
    }
}