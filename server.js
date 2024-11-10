const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('./src/database/config');

const remove_id = require('./src/utils/remove_id');
/* const JWTStrategy = require('passport-jwt').Strategy; */
const { ObjectId } = require('mongodb');
const JwtStrategy = require('passport-jwt').Strategy;
const categoriesRouter = require('./src/routes/categories');
const productsRouter = require('./src/routes/products');
const authRouter = require('./src/routes/auth');
const passport = require('passport');
const {
  passportLocalStrategy,
  passportJWTStrategy,
} = require('./src/config/passport');
const favoritesRouter = require('./src/routes/favorites');

const { ExtractJwt } = require('passport-jwt');
const { header } = require('express-validator');
const { validateFields } = require('./src/validations/validateFields');

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

passport.use(passportLocalStrategy);
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_JWT_SEED,
    },
    async function (jwt_payload, cb) {
      try {
        console.log(arguments);
        const users = await connectToCollection('users');
        const { _id: id } = jwt_payload;

        /* 672ac1c5269e19ede8d4d740 */
        const foundUser = await users.findOne(
          {
            _id: new ObjectId(id),
          },
          remove_id()
        );
        if (!foundUser) {
          return cb(null, false, { message: 'auth error' });
        }
        return cb(null, foundUser);
      } catch (error) {
        return cb(Error('server error'), false, {
          message: 'server error',
        });
      } finally {
        disconnectFromMongo();
      }
    }
  )
);
server.use(passport.initialize());
const env = require('dotenv').config();
const { PORT } = env.parsed;

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ ok: true });
});

server.use('/api/categories', categoriesRouter);
server.use('/api/products', productsRouter);
server.use('/api/favorites', favoritesRouter);
server.use('/api/auth', authRouter);
server.post(
  '/api/testauth',
  [
    header('Authorization').notEmpty().withMessage('no auth token present'),
    validateFields,
  ],
  function (req, res, next) {
    passport.authenticate(
      'jwt',
      { session: false },
      function (err, user, info) {
        if (!user || err) {
          return res
            .status(401)
            .json({ ok: false, message: info.message || 'error' });
        }

        return next();
      }
    )(req, res, next);
  },
  function (req, res) {
    try {
      res.send({ ok: 'next' });
    } catch (error) {
      console.log('in error');
      res.status(500).json({ ok: false, message: error.message });
    }
  }
);
/* server.post(
  '/api/testauth',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, function (_, user, err) {
      console.log(err);
      if (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    console.log('req user', req.user);
    return res.status(200).json({ ok: true, message: 'ok' });
  }
); */
//USERS
server.get('/users', async (req, res) => {
  try {
    const users = await connectToCollection('users');
    const usersCollection = await users.find({}, remove_id()).toArray();

    return res.status(200).json({ ok: true, users: usersCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});

/* server.post('/users', validateUserCreate(userCreateSchema)); */

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

//PRODUCTS
