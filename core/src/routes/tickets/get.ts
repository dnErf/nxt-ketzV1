import { Request, Response } from 'express';

const getAll = async (req:Request, res:Response) => {
  res.sendStatus(200)
}

const getById = async (req:Request, res:Response) => {
  res.sendStatus(200)
}

export { getAll, getById }