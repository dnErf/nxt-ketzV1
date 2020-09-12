import express from 'express'

let router = express.Router();

router.get('api/users/signin', (req, res) => {
  res.send('User Sign In');
});

export { router as signinRoute };