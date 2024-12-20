const bcrypt = require('bcryptjs');
const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');
const { ObjectId } = require('mongodb');
const { ExtractJwt } = require('passport-jwt');
const remove_id = require('../utils/remove_id');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
exports.passportJWTStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_JWT_SEED,
  },
  async function (jwt_payload, cb) {
    try {
      const users = await connectToCollection('users');
      const { _id: id } = jwt_payload;

      const foundUser = await users.findOne(
        {
          _id: new ObjectId(id),
        },
        remove_id()
      );
      if (!foundUser) {
        return cb(null, false, { message: 'auth error' });
      } else {
      }
      return cb(null, { id, ...foundUser });
    } catch (error) {
      return cb(null, false, {
        message: 'server error',
      });
    }
  }
);

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
        return cb(null, null, { message: 'login error' });
      }
      if (user.hasOwnProperty('googleId')) {
        return cb(null, false, {
          message:
            'user with this email already linked to google use google login',
        });
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
