import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequest, ValidateRequest } from '@ketketz/common';
// ---
import { User } from '../models/user'

let router = express.Router();

const Route = 'api/users/signup';
const Validator = [
  body('email')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 characters')
];

router.post(
  Route, 
  Validator, 
  ValidateRequest, 
  async (req:Request, res:Response) => {
    let { email, password } = req.body;
    let isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      throw new BadRequest('email is in use')
    }

    let user = User.build({ email, password });
    await user.save();

    let userJwt = jwt.sign(
      { id: user.id, email: user.email }, process.env.JWT
    );

    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signupRoute };