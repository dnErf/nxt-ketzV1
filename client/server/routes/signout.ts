import express from 'express'

let router = express.Router();

router.get('api/users/signout', (req, res) => {
  res.send('User Sign Out');
});

export { router as signoutRoute };