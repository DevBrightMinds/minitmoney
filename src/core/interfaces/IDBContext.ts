export interface IDBContext {
    buildDBQueryURL(): Promise<string>;
}