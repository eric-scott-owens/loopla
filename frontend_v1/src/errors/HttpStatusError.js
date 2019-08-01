export default class HttpStatusError extends Error {
    constructor(statusCode, statusMessage, data, ...args) {
        super(...args)
        Error.captureStackTrace(this, HttpStatusError)
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }
};