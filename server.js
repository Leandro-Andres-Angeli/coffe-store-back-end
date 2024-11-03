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
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

const env = require('dotenv').config();
const { PORT } = env.parsed;

server.use(cors());

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
