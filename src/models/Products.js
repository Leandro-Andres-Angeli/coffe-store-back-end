const { Schema, model } = require('mongoose');

const ProductsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = model('Products', ProductsSchema);
