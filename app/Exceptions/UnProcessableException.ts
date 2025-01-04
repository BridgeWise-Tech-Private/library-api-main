import BaseException from 'App/Exceptions/BaseException';

export default class UnProcessableException extends BaseException {
    constructor(message: string, code = 'E_UNPROCESSABLE_ENTITY', meta?: Record<string, unknown>) {
        super(message, 422, code, meta);
    }
}
