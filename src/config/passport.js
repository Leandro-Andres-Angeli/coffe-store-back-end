const bcrypt = require('bcryptjs');
const { connectToCollection } = require('../database/config');
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
exports.passportJWTStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_JWT_SEED,
  },
  function (jwt_payload, cb) {
    console.log('JWT', jwt_payload);
  }
);
/* exports.passportJWTStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_JWT_SEED,
  },
  async function (JWTPayload, cb) {
    try {
      console.log('JWT', JWTPayload.id);
      if (JWTPayload === null) {
        console.log('no token');

        return cb(new Error('authentication error', false));
      }
      const user = {
        id: '672ac1c5269e19ede8d4d940',
        name: 456,
        lastName: 'user',
        email: 'user@gmail.com',
        favorites: [
          {
            id: 'COF009',
            name: 'Americano',
            description: 'Espresso shots diluted with hot water.',
            category: 'Coffee',
            price: 3.25,
          },
          {
            id: 'COF011',
            name: 'Affogato',
            description:
              'Vanilla gelato or ice cream drowned in a shot of hot espresso.',
            category: 'Coffee',
            price: 5.5,
          },
          {
            id: 'COF026',
            name: 'Café au Lait',
            description:
              'French-style coffee with equal parts coffee and steamed milk.',
            category: 'Coffee',
            price: 4,
          },
          {
            id: 'COF004',
            name: 'Cortado',
            description: 'Equal parts espresso and steamed milk.',
            category: 'Coffee',
            price: 3.75,
          },
        ],
      };
      cb(null, user);
    } catch (error) {
    
      return cb(error, false);
    }
  }
); */
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
        return cb(null, null, { message: ' ' });
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
