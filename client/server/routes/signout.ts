import express from 'express'

let router = express.Router();

router.get('api/users/signout', (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRoute };