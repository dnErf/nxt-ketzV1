import jwt from 'jsonwebtoken';
import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequest, ValidateRequest } from '@ketketz/common';
// ---
import { User } from '../models/user'
import { Hashword } from '../services/hashword';

let router = express.Router();

const Route = 'api/users/signin';
const Validator = [
  body('email')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 characters')
];

router.get(Route, Validator, ValidateRequest, async (req, res) => {

    let { email, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequest('invalid email/password');
    }

    let matchPassword = await Hashword.compare(existingUser.password, password);

    if (!matchPassword) {
      throw new BadRequest('invalid email/password');
    }

    let userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email }, process.env.JWT
    );

    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);

  }
);

export { router as signinRoute };