const { Router } = require('express');
const { postUser, loginUser } = require('../controllers/auth');
const {
  userCreateSchema,
  validateUserCreate,
} = require('../middlewares/validation');
const router = Router();
router.post('/newUser', validateUserCreate(userCreateSchema), postUser);
router.post('/', loginUser);
module.exports = router;
