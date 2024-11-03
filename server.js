const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('./src/database/config');

const bcrypt = require('bcryptjs');
const remove_id = require('./src/utils/remove_id');
const {
  validateUserCreate,
  userCreateSchema,
} = require('./src/middlewares/validation');

const { generateToken } = require('./utils/generateToken');
const categoriesRouter = require('./src/routes/categories');
const productsRouter = require('./src/routes/products');
const authRouter = require('./src/routes/auth');
const passport = require('passport');
const { handleLogin } = require('./src/config/passport');
const LocalStrategy = require('passport-local').Strategy;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
/* passport.use(handleLogin); */
/* passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email = 'user@gmail.com', password, cb) {
      try {
        console.log(email);

        const users = await connectToCollection('users');

        return users.findOne({ email }).then((user) => {
          if (!user) {
            return cb(null, false, {
              message: 'Incorrect email or password.',
            });
          }

          return cb(null, user, {
            message: 'Logged In Successfully',
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  )
); */
passport.use(
  new LocalStrategy(
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
        const comparePasswordHashed = bcrypt.compareSync(
          password,
          user.password
        );
        console.log(comparePasswordHashed);

        if (!comparePasswordHashed) {
          return cb(null, null, { message: 'login error ' });
        }

        return cb(null, user, { message: 'user found' });
      } catch (error) {
        console.log('in error');

        console.log(error);
      }
    }
  )
);

/* passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    function (username = 'user@gmail.com', password, cb) {
      const users = connectToCollection('users');
      const user = users.findOne({
        email: username,
      });
      if (err) {
        console.log('in error');

        return cb(err);
      }

      console.log(user);
      return user;
    }
  )
); */
server.use(passport.initialize());

const env = require('dotenv').config();
const { PORT } = env.parsed;

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ ok: true });
});

server.use('/api/categories', categoriesRouter);
server.use('/api/products', productsRouter);
server.use('/api/auth', authRouter);

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
