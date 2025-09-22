import { AppResponse } from "../../core/entities/AppResponse";

export class AppResponses {
    // we could add many other responses here - based on whatever available HTTP responses
    successResponse(response: Object) {
        return { status: true, data: response, message: "", responseCode: 200 } as AppResponse;
    }

    errorResponse(message: string) {
        return { status: false, data: {}, message: message, responseCode: 500 } as AppResponse;
    }

    notFoundResponse(message: string) {
        return { status: false, data: {}, message: message, responseCode: 404 } as AppResponse;
    }
}