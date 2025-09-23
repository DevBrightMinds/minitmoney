import { Transaction } from "../../generated/prisma";
import { Filters } from "../../core/entities/Filters";
import { BaseRepository } from "./base/BaseRepository";
import { Pagination } from "../../core/entities/Pagination";
import { AppResponse } from "../../core/entities/AppResponse";
import { Validator } from "../../application/validation/Validator";
import { AppResponses } from "../../application/responses/AppResponses";
import { ITransactionsRepository } from "../../core/interfaces/ITransactionsRepository";

export class TransactionsRepository extends BaseRepository implements ITransactionsRepository {
    public Validations: Validator | undefined;

    constructor() {
        super();
        this.Validations = new Validator();
    }

    async getAllAsync(filter: Filters): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: filter.userId,
                currency: filter.currency ? { contains: filter.currency } : "",
                amount: {
                    gte: filter.amount,
                    lte: filter.amount,
                },
                createdAt: filter.date ? new Date(filter.date) : ""
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return new AppResponses().successResponse(transactions);
    }

    async getAsync(id: number): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        const response = await prisma.transaction.findFirst({
            where: { id: id },
        });

        return new AppResponses().successResponse(response as Transaction);
    }

    async createAysnc(item: Transaction): Promise<AppResponse> {
        let exchangeRate = 1;
        let convertedAmount = item.amount;

        const prisma = await this.createDBConnection();

        const isModelValid = await this.Validations?.validateTransaction(item);

        if (isModelValid !== "")
            return new AppResponses().errorResponse(isModelValid as string);

        // handling exchange rates 
        if (item.currency === "USD") {
            // ZAR -> USD
            exchangeRate = 0.055;
        } else if (item.currency === "KES") {
            // ZAR -> KES
            exchangeRate = 7.1;
        }

        item.exchangeRate = exchangeRate;
        // handling amount conversion based on rates
        convertedAmount = item.amount * exchangeRate;

        // handling fees calculations
        const flatFee = 5;
        const percentageFee = (item.amount * 0.02);
        const totalFee = flatFee + percentageFee;

        const netAmount = item.amount - totalFee;
        const grossAmount = item.amount;

        item.netAmount = netAmount;
        item.amount = grossAmount;

        const response = await prisma.transaction.create({ data: item });

        return new AppResponses().successResponse(response);
    }

    async updateAysnc(item: Transaction): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        const response = await prisma.transaction.update({
            where: { id: item?.id },
            data: item,
        });

        return new AppResponses().successResponse(response);
    }

    async deleteAysnc(item: Transaction): Promise<AppResponse> {
        const prisma = await this.createDBConnection();

        const response = await prisma.transaction.delete({
            where: { id: item?.id },
        });

        return new AppResponses().successResponse(response);
    }
}