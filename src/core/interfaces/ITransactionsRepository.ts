import { Filters } from "../entities/Filters";
import { Transaction } from "../../generated/prisma";
import { AppResponse } from "../entities/AppResponse";

export interface ITransactionsRepository {
    getAsync(id: number): Promise<AppResponse>;
    getAllAsync(filter: Filters): Promise<AppResponse>;
    createAysnc(item: Transaction): Promise<AppResponse>;
    updateAysnc(item: Transaction): Promise<AppResponse>;
    deleteAysnc(item: Transaction): Promise<AppResponse>;
}