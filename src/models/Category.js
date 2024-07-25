const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  category: { type: String, required: true },
  id: { type: String, required: true },
  _id: 0,
});

module.exports = model('Category', CategorySchema);
