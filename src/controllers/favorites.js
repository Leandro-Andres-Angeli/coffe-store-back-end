const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const remove_id = require('../utils/remove_id');

const pushProducts = async (req, res) => {
  try {
    /* 672ac1c5269e19ede8d4d940 */
    const userId = req.params;
    console.log('id param', userId);
    console.log('user', req.user);

    const product = req.body;

    const users = await connectToCollection('users');
    const userUpdateFavorites = await users.updateOne(userId, {
      $push: { favorites: product },
    });
    console.log(userUpdateFavorites);

    return res.status(200).json({ ok: true, message: 'push' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'server error' });
  }
};
module.exports = { pushProducts };
