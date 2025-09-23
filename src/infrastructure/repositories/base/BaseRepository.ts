import { DBContext } from "../../data/DBContext";
import { PrismaClient } from "../../../generated/prisma";

export class BaseRepository extends DBContext {
    protected prisma: PrismaClient | undefined;

    constructor() {
        super();
    }
    // this can obviously be extended to carry more logic - such as other methodds detailing the base crud operations - such that 
    // all other repositories - will extend this class - and thus the base crud operations 
    // meaning - the other repositories will only make use of additional methods if they are required, but that 
    // there would not be a need to define the same crud operations in every repository
    async getDBConnection(): Promise<void> {
        this.prisma = await this.createDBConnection();
    }
}