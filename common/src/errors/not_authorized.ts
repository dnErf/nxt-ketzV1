import { CustomError } from './_custom_error';

export class NotAuthorized extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorized.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
