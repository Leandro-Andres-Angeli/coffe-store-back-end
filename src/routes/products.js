const { Router } = require('express');
const {
  getProducts,
  getProductsByCategory,
  getProductsByRegex,
} = require('../controllers/products');
const { query, validationResult } = require('express-validator');
const { validateFields } = require('../validations/validateFields');

const router = Router();
/* router.get('/', function (req, res) {
  return res.status(200).json({
    ok: true,
    message: 'products',
  });
}); */
// get all products
router.get('/', getProducts);
router.get('/category', getProductsByCategory);
router.get(
  '/search',
  [
    query('name')
      .notEmpty()
      .withMessage('name query required')
      .custom((val) => {
        return val.length > 3;
      })
      .withMessage('query must be at least 3 chars length'),
    validateFields,
  ],
  getProductsByRegex
);

// get all products

module.exports = router;
