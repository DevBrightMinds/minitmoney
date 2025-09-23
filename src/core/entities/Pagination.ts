import { Filters } from "./Filters";

export class Pagination {
    // we could add filters to this pagination
    constructor(
        public Filter: Filters,
        public Page?: number,
        public Limit?: number,
        public PageSize?: number,
        public TotalPages?: number
    ) { }
}