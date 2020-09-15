import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request_validation_error';

export const ValidateRequest = (err:Error, req:Request, res:Response, next:NextFunction) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
}
