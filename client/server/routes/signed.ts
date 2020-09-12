import express from 'express'

let router = express.Router();

router.get('api/users/signed', (req, res) => {
  res.send('Current Signed User');
});

export { router as signedRoute };