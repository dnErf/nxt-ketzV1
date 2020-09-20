import jwt from 'jsonwebtoken';
import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequest, ValidateRequest } from '@ketketz/common';
// ---

const router = express.Router();

export { router as ticketRoute };