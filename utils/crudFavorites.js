crudFavorites = Object.freeze({
  push: (product) => ({ $push: { favorites: product } }),
  pull: (product) => ({ $pull: { favorites: { id: product.id } } }),
});
module.exports = crudFavorites;
