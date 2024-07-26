const Joi = require('joi');
const schema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
  .options({ abortEarly: false });
const validateRequest = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body);

    const {
      error: { details },
    } = validationResult;

    if (Boolean(validationResult.error)) {
      return res.status(400).json({
        ok: false,
        errors: details.map(({ message }) => message.replaceAll('"', '')),
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = validationResult.value;
    next();
  };
};
module.exports = { validateRequest, schema };
