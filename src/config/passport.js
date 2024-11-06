const bcrypt = require('bcryptjs');
const { connectToCollection } = require('../database/config');
const LocalStrategy = require('passport-local').Strategy;
exports.passportLocalStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function (email, password, cb) {
    try {
      const users = await connectToCollection('users');

      const user = await users.findOne({ email });
      if (!user) {
        return cb(null, null, { message: 'login error ' });
      }
      const comparePasswordHashed = bcrypt.compareSync(password, user.password);

      if (!comparePasswordHashed) {
        return cb(null, null, { message: 'login error ' });
      }

      return cb(null, user, { message: 'user found' });
    } catch (error) {
      console.log('in error');

      console.log(error);
    }
  }
);
