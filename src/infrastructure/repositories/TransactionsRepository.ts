import { Transaction } from "../../generated/prisma";
import { BaseRepository } from "./base/BaseRepository";
import { Pagination } from "../../core/entities/Pagination";
import { AppResponse } from "../../core/entities/AppResponse";
import { AppResponses } from "../../application/responses/AppResponses";
import { ITransactionsRepository } from "../../core/interfaces/ITransactionsRepository";
import { Filters } from "../../core/entities/Filters";

export class TransactionsRepository extends BaseRepository implements ITransactionsRepository {
    constructor() { super(); }

    async getAllAsync(filter: Filters): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        const transactions = await prisma.transaction.findMany({
            where: {
                currency: filter?.currency,
                amount: filter?.amount,
                // date: filter.date as any
            }
        });

        return new AppResponses().successResponse(transactions);
    }
    async getAsync(id: number): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        return new AppResponses().successResponse(await prisma.transaction.findFirst({
            where: { id: id },
        }) as any);
    }
    async createAysnc(item: Transaction): Promise<AppResponse> {
        const prisma = await this.createDBConnection();
        return new AppResponses().successResponse(await prisma.transaction.create(item as any) as any);
    }
    async updateAysnc(item: Transaction): Promise<AppResponse> {
        const prisma = await this.createDBConnection();
        return new AppResponses().successResponse(await prisma.transaction.update({
            where: { id: item?.id },
            data: item,
        }));
    }
    async deleteAysnc(item: Transaction): Promise<AppResponse> {
        const prisma = await this.createDBConnection();
        return new AppResponses().successResponse(await prisma.transaction.delete({
            where: { id: item?.id },
        }));
    }

}