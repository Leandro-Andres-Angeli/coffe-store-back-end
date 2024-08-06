const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const remove_id = require('../utils/remove_id');

const getProducts = async (req, res) => {
  try {
    const products = await connectToCollection('products');
    const productsCollection = await products
      .find({}, remove_id())
      .limit(10)

      .toArray();

    return res.status(200).json({ ok: true, products: productsCollection });
  } catch (err) {
    return res.status(404).json({ error: err.message, ok: false });
  } finally {
    return disconnectFromMongo();
  }
};

module.exports = { getProducts };
