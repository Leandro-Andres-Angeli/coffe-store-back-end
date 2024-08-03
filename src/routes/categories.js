const { Router } = require('express');
const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const remove_id = require('../utils/remove_id');
const router = Router();

//CATEGORIES
router.get('/', async (req, res) => {
  console.log('in');
  try {
    const categories = await connectToCollection('categories');
    const categoriesCollection = await categories
      .find({}, remove_id())
      .toArray();

    return res.status(200).json({ ok: true, categories: categoriesCollection });
  } catch (err) {
    return res.status(404).json({ error: err.message, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});

//SEARCH LIKE
router.get('/search', async (req, res) => {
  const { regex } = req.query;
  try {
    const categories = await connectToCollection('categories');
    const categoriesCollection = await categories
      .find({ category: { $regex: regex, $options: 'i' } }, remove_id())
      .toArray();

    return res.status(200).json({ ok: true, categories: categoriesCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});
//SEARCH LIKE
//CATEGORIES
module.exports = router;
