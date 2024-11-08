const { Router } = require('express');

const { query, validationResult } = require('express-validator');
const { validateFields } = require('../validations/validateFields');
const { pushProducts } = require('../controllers/favorites');

const router = Router();

// get all products
router.post('/add', pushProducts);

// get all products

module.exports = router;
