export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static unauthorized(message = 'No autenticado') {
        return new HttpError(401, message);
    }

    static conflict(message) {
        return new HttpError(409, message);
    }
}