const { header, validationResult } = require('express-validator');

const validateThereIsToken = [
  header('Authorization').notEmpty().withMessage('not authorized'),
  function (req, res, next) {
    const result = validationResult(req);
    if (result.errors.length !== 0) {
      return res.status(401).json({ ok: false, message: result.errors[0].msg });
    }

    return next();
  },
];
module.exports = validateThereIsToken;
