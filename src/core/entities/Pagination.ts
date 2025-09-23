export class Pagination {
    // we could add filters to this pagination
    constructor(
        public PageNumber: number = 0,
        public PageSize: number = 0,
        public TotalPages: number = 0,
    ) { }
}