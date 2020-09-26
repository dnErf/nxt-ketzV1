import { Request, Response } from 'express';

const createNew = async (req:Request, res:Response) => {
  res.sendStatus(200)
}

export { createNew }