const { Router } = require('express');
const { postUser, loginUser } = require('../controllers/auth');
const {
  userCreateSchema,
  validateUserCreate,
} = require('../middlewares/validation');
const passport = require('passport');
const router = Router();
router.post('/newUser', validateUserCreate(userCreateSchema), postUser);
/* router.post('/', loginUser); */
router.post('/', loginUser);

/* router.post('/google', function (req, res) {
  return res.status(200).json({ ok: true, message: 'google' });
}); */
module.exports = router;
