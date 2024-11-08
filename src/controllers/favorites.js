const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const { ObjectId } = require('mongodb');
const remove_id = require('../utils/remove_id');

const pushProducts = async (req, res) => {
  try {
    /* 672ac1c5269e19ede8d4d940 */
    const { userId } = req.query;
    console.log('id param', userId);
    console.log('user', req.user);
    console.log('body', req.body);
    const product = req.body;

    const users = await connectToCollection('users');
    /*  const userUpdateFavs = await users.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      { $push: { favorites: req.body } }
    ); */
    const userUpdateFavs = await users.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      { $pull: { favorites: { id: 'COF029' } } }
    );
    /*  COF029 */
    console.log(userUpdateFavs);

    return res.status(200).json({ ok: true, message: 'push' });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ ok: false, message: 'server error' });
  }
};
module.exports = { pushProducts };
