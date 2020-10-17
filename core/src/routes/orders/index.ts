import jwt from 'jsonwebtoken';
import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequest, ValidateRequest } from '@ketketz/common';
// ---
import { createNew } from './create'
import { getAll, getById } from './get'
import { updateById } from './update'

const router = express.Router();

const validator = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
];

router
  .post('/api/orders', validator, createNew)
  .put('/api/orders/:id', validator, updateById)
  .get('/api/orders/:id', getById)
  .get('/api/orders', getAll)

export { router as orderRoute };