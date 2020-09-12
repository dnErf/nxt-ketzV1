import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

let router = express.Router();

let validator = [
  body('email')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 characters')
];

router.post('api/users/signup', validator, (req:Request, res:Response) => {
  let err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).send(err.array())
  }

  let { email, password } = req.body;

  res.send({});
});

export { router as signupRoute };