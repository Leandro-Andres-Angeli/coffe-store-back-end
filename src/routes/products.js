const { Router } = require('express');
const {
  getProducts,
  getProductsByCategory,
  getProductsByRegex,
} = require('../controllers/products');

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
router.get('/search', getProductsByRegex);

// get all products

module.exports = router;
