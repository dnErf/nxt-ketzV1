import { CustomError } from './_custom_error';

export class BadRequest extends CustomError {
  constructor(public message:string) {
    super(message);
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
  statusCode = 400;
  serializeErrors() {
    return [{ message: this.message }]
  }
}
