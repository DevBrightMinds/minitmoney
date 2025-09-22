
export class AppResponse {
    constructor(
        public status: boolean = false,
        public data: Object,
        public message: string = "",
        public responseCode: number = 0
    ) { }
}
