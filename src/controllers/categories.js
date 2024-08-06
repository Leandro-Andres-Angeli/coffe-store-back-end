const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const remove_id = require('../utils/remove_id');

const getCategories = async (req, res) => {
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
};
const getCategoriesByRegex = async (req, res) => {
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
};
module.exports = { getCategories, getCategoriesByRegex };
