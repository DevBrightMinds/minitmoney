export class Filters {
    constructor(
        public currency: string = "",
        public date: Date = new Date(),
        public amount: number = 0,
    ) { }
}