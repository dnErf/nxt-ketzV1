import { CustomError } from './_custom_error';

export class NotFound extends CustomError {
  constructor() {
    super('route not found');
    Object.setPrototypeOf(this, NotFound.prototype);
  }
  statusCode = 404;
  serializeErrors() {
    return [{ message: this.message }]
  }
}
