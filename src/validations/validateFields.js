const { validationResult } = require('express-validator');

exports.validateFields = function (req, res, next) {
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors: errors });
  }

  next();
};
