import { ValidationError } from 'express-validator';
import { CustomError } from './_custom_error';

export class RequestValidationError extends CustomError {
  constructor(public errors:ValidationError[]) {
    super('invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  statusCode = 404;
  serializeErrors() {
    return this.errors.map((err) => { 
      return {
        message: err.msg, field: err.param
      }
    });
  }
}
