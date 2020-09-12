import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/_custom_error';

export const ErrorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  else {
    res.status(400).send({
      errors: [{ message: 'something went wrong with server request'}]
    })
  }
  return;
}
