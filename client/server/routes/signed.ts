import express from 'express';
import { CurrentUser } from '@ketketz/common';

let router = express.Router();

router.get('api/users/signed', CurrentUser, (req, res) => {
  res.send({ current: req.currentUser || null });
});

export { router as signedRoute };