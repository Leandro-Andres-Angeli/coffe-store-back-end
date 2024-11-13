const passport = require('passport');
const { generateToken } = require('../../utils/generateToken');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const bcrypt = require('bcryptjs');
const postUser = async (req, res) => {
  const { name, lastName, email, password } = req.body;
  try {
    const users = await connectToCollection('users');

    const user = await users.findOne({ email });

    if (user) {
      throw new Error('user with this email already exists');
    }
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      name,
      lastName,
      email,
      password: hashedPassword,
      favorites: [],
      avatar: '',
    };

    await users.insertOne(newUser);

    return res.status(201).json({
      ok: true,
      user: { name: newUser.name, email: newUser.email },

      message: 'user created',
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,

      message: err.message,
    });
  } finally {
    return disconnectFromMongo();
  }
};
const loginUser = async function (req, res) {
  passport.authenticate(
    'local',
    { session: false },
    async function (err, user, info) {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user,
        });
      }
      let token;
      try {
        token = await generateToken(user);
      } catch (error) {
        return res
          .status(500)
          .json({ ok: false, message: error.message || 'auth error' });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.send(err);
        }
        const { password, _id: id, ...userWithoutPassword } = user;

        return res.json({
          ok: true,
          user: { id, ...userWithoutPassword },
          token,
        });
      });
    }
  )(req, res);
};
const authenticateUser = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (!user || err) {
      return res
        .status(401)
        .json({ ok: false, message: info.message || 'error' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
module.exports = { postUser, loginUser, authenticateUser };
