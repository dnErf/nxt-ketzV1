import { Request, Response } from 'express';
import { NotFound } from '@ketketz/common';

export const getAll = async (req:Request, res:Response) => {
  res.send({});
}
