const passport = require('passport');
const { generateToken } = require('../../utils/generateToken');
const { handleLogin } = require('../config/passport');
const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const bcrypt = require('bcryptjs');
const postUser = async (req, res) => {
  const { name, lastName, email, password } = req.body;
  try {
    const users = await connectToCollection('users');
    console.log('req body', req.body);
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
    };

    const insertUser = await users.insertOne(newUser);
    // const token = await generateToken(user.id, name);

    const insertedDocId = insertUser.insertedId.toString();

    /*   const token = await generateToken(insertedDocId, name); */

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
    async (err, user, info) => {
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
        return res.status(500).json({ ok: false, message: 'auth error' });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
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
/* const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    passport.authenticate(
      'local',
      { session: false },
      function (err, user, info) {
        console.log(user);
        console.log('in');
      }
    );
    return res.status(200).json({
      ok: true,
      message: 'login',
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ ok: false, message: 'error de servidor' });
  } finally {
    return disconnectFromMongo();
  }
}; */
/* const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await connectToCollection('users');
    const user = await users.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({ ok: true, message: 'auth error' });
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(404).json({ ok: true, message: 'auth error' });
    }
    const { password: userPassword, _id: id, ...restOfUser } = user;

    const token = await generateToken(restOfUser);

    return res.status(200).json({
      ok: true,
      message: 'login succesful',
      user: { id, ...restOfUser },
      token,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'error de servidor' });
  } finally {
    return disconnectFromMongo();
  }
}; */
module.exports = { postUser, loginUser };
