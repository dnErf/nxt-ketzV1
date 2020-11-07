import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequireAuth, ValidateRequest, BadRequest } from '@ketketz/common';
// ---
import { createNew } from './create'
import { getAll, getById } from './get'
import { deleteById } from './delete'

const router = express.Router();

const validator = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided'),
];

router
  .post('/api/orders', RequireAuth, validator, ValidateRequest, createNew)
  .put('/api/orders/:id', RequireAuth, deleteById)
  .get('/api/orders/:id', RequireAuth, getById)
  .get('/api/orders', RequireAuth, getAll)

export { router as orderRoute };