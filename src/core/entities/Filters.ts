export class Filters {
    constructor(
        public userId: number = 0,
        public currency: string = "",
        public date: Date = new Date(),
        public amount: number = 0,
    ) { }
}