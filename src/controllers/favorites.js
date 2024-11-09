const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const { ObjectId } = require('mongodb');
const remove_id = require('../utils/remove_id');
const crudFavorites = require('../../utils/crudFavorites');

const pushProducts = async (req, res) => {
  try {
    /* 672ac1c5269e19ede8d4d940 */
    const { userId, action } = req.query;

    const product = req.body;

    const users = await connectToCollection('users');

    const crudOperation = await users.updateOne(
      {
        _id: new ObjectId(userId),
      },
      /*  { $pull: { favorites: { id: product.id } } } */
      crudFavorites[action](product)
    );

    if (crudOperation.modifiedCount !== 1) {
      return res
        .status(500)
        .json({ ok: false, message: 'error updating favorites' });
    }
    return res
      .status(200)
      .json({ ok: true, message: 'favorites updated', product });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ ok: false, message: 'server error' });
  }
};
module.exports = { pushProducts };
