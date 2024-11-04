const { options } = require('joi');
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
      .sort({ _id: -1 })
      .limit(10)

      .toArray();

    return res.status(200).json({ ok: true, products: productsCollection });
  } catch (err) {
    return res.status(404).json({ message: err.message, ok: false });
  } finally {
    return disconnectFromMongo();
  }
};
const getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  const page = Number(req.query.page);
  const resultsPerPage = 3;
  let prev = false;

  let next = false;
  if (page !== 0) {
    prev = true;
  }
  try {
    const products = await connectToCollection('products');
    const productsCollection = await products
      .find({ category }, remove_id())
      .sort({ name: 1 })
      .skip(page * 5)
      //pagination trick
      .limit(resultsPerPage + 1)
      //pagination trick
      .toArray();
    if (productsCollection.length > resultsPerPage) {
      next = true;
      productsCollection.pop();
    }
    return res
      .status(200)
      .json({ ok: true, prev, next, products: productsCollection });
  } catch (err) {
    return res.status(404).json({ message: err.message, ok: false });
  } finally {
    return disconnectFromMongo();
  }
};
const getProductsByRegex = async (req, res) => {
  try {
    const products = await connectToCollection('products');
    const productsSearch = await products
      .find({ name: { $regex: req.query.name, $options: 'i' } }, remove_id())
      .toArray();
    console.log(productsSearch);
    return res.status(200).json({ ok: true, data: productsSearch });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'error de servidor' });
  }
};
module.exports = { getProducts, getProductsByCategory, getProductsByRegex };
