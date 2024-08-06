const { Router } = require('express');
const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const remove_id = require('../utils/remove_id');
const {
  getCategories,
  getCategoriesByRegex,
} = require('../controllers/categories');
const router = Router();

//CATEGORIES
//get all categories
router.get('/', getCategories);
//get all categories

//SEARCH LIKE
router.get('/search', getCategoriesByRegex);
//SEARCH LIKE
//CATEGORIES
module.exports = router;
