import { Transaction } from "../../generated/prisma";
import { Filters } from "../../core/entities/Filters";
import { BaseRepository } from "./base/BaseRepository";
import { AppResponse } from "../../core/entities/AppResponse";
import { AppResponses } from "../../application/responses/AppResponses";
import { ITransactionsRepository } from "../../core/interfaces/ITransactionsRepository";

export class TransactionsRepository extends BaseRepository implements ITransactionsRepository {
    constructor() { super(); }

    async getAllAsync(filter: Filters): Promise<AppResponse> {
        let transactions: Transaction[] = [];

        if (Object.values(filter)?.length > 0)
            transactions = await this.prisma.Transaction.findMany({
                where: {
                    currency: { contains: filter?.currency },
                    amount: filter?.amount,
                    date: { contains: filter.date }
                }
            });
        else
            transactions = await this.prisma.Transaction.findMany();

        return new AppResponses().successResponse(transactions);
    }

    async getAsync(id: number): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.Transaction.findFirst({
            where: { id: id },
        }));
    }

    async createAysnc(item: Transaction): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.Transaction.create(item));
    }

    async updateAysnc(item: Transaction): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.Transaction.update({
            where: { id: item?.id },
            data: item,
        }));
    }

    async deleteAysnc(item: Transaction): Promise<AppResponse> {
        return new AppResponses().successResponse(await this.prisma.Transaction.delete({
            where: { id: item?.id },
        }));
    }

}