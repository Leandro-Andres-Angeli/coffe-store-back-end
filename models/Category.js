const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
  category: { type: String, required: true },
  id: { type: String, required: true },
});
/* CategorySchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
}); */
module.exports = model('Category', CategorySchema);
