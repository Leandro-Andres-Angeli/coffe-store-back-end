const express = require('express');

require('dotenv').config();
const cors = require('cors');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('./src/database/config');

const remove_id = require('./src/utils/remove_id');

const categoriesRouter = require('./src/routes/categories');
const productsRouter = require('./src/routes/products');
const authRouter = require('./src/routes/auth');
const passport = require('passport');
const {
  passportLocalStrategy,
  passportJWTStrategy,
} = require('./src/config/passport');

const favoritesRouter = require('./src/routes/favorites');

const { header, validationResult } = require('express-validator');
const validateThereIsToken = require('./src/validations/validateThereIsToken');
const { authenticateUser } = require('./src/controllers/auth');
const userRoutes = require('./src/routes/users');

const server = express();
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);

passport.use(passportLocalStrategy);
passport.use(passportJWTStrategy);

server.use(passport.initialize());

const PORT = process.env.PORT;

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ ok: true });
});

server.use('/api/categories', categoriesRouter);
server.use('/api/products', productsRouter);
server.use(
  '/api/favorites',
  validateThereIsToken,
  authenticateUser,
  favoritesRouter
);
server.use('/api/auth', authRouter);
server.use('/api/users', userRoutes);
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
