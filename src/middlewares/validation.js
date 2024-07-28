const Joi = require('joi');
const userCreateSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    lastName: Joi.string().required(),
    name: Joi.string().required(),
  })
  .options({ abortEarly: false });
const validateUserCreate = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body);
    if (!validationResult) {
      return res.status(500).json({ ok: false, message: 'server error' });
    }
    if (Boolean(validationResult.error)) {
      const {
        error: { details },
      } = validationResult;
      return res.status(400).json({
        ok: false,
        errors: details.map((error) => ({
          [error.path[0]]: error.message.replaceAll('"', ''),
        })),
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = validationResult.value;
    next();
  };
};
const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
module.exports = { validateUserCreate, userCreateSchema };
