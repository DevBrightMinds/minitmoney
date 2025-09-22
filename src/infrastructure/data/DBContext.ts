import { ENVVariables } from "../../core/utils/EnvVariables";
import { IDBContext } from "../../core/interfaces/IDBContext";

export class DBContext implements IDBContext {
    constructor() { }

    async buildDBQueryURL(): Promise<string> {
        return `mysql://${ENVVariables.DbUsername}:${ENVVariables.DbPassword}@${ENVVariables.DbHost}:${ENVVariables.DbHost}/${ENVVariables.Database}`;
    }
}