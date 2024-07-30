const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('./src/database/config');

const { dbConnection } = require('./src/database/config');
const Category = require('./src/models/Category');
const bcrypt = require('bcryptjs');
const remove_id = require('./src/utils/remove_id');
const {
  validateUserCreate,
  userCreateSchema,
} = require('./src/middlewares/validation');
const User = require('./src/models/User');
const { generateToken } = require('./utils/generateToken');
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const env = require('dotenv').config();
const { PORT } = env.parsed;

server.use(cors());

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ ok: true });
});
//CATEGORIES
server.get('/categories', async (req, res) => {
  try {
    const categories = await connectToCollection('categories');
    const categoriesCollection = await categories
      .find({}, remove_id())
      .toArray();

    return res.status(200).json({ ok: true, categories: categoriesCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});

//SEARCH LIKE
server.get('/categories/search', async (req, res) => {
  const { regex } = req.query;
  try {
    const categories = await connectToCollection('categories');
    const categoriesCollection = await categories
      .find({ category: { $regex: regex, $options: 'i' } }, remove_id())
      .toArray();

    return res.status(200).json({ ok: true, categories: categoriesCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});
//SEARCH LIKE
//CATEGORIES

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
//POST
server.post(
  '/users',
  validateUserCreate(userCreateSchema),
  async (req, res) => {
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
      const newUser = new User({
        name,
        lastName,
        email,
        password: hashedPassword,
      });

      const insertUser = await users.insertOne(newUser);
      // const token = await generateToken(user.id, name);

      const insertedDocId = insertUser.insertedId.toString();

      const token = await generateToken(insertedDocId, name);

      return res.status(201).json({
        ok: true,
        user: { name: newUser.name, email: newUser.email, token },

        message: 'user created',
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,

        error: err.message,
      });
    } finally {
      return disconnectFromMongo();
    }
  }
);

//USERS

//PRODUCTS

server.get('/products', async (req, res) => {
  try {
    const products = await connectToCollection('products');
    const productsCollection = await products.find({}, remove_id()).toArray();

    return res.status(200).json({ ok: true, products: productsCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});

server.get('/products/search', async (req, res) => {
  // console.log(req.query);
  const { category } = req.query;

  try {
    const products = await connectToCollection('products');
    const categories = await connectToCollection('categories');

    const getCategoryByQuery = await categories.findOne({ category });
    console.log(getCategoryByQuery);

    // console.log('ce', cat);
    const productsCollection = await products
      .find({ category: getCategoryByQuery.category }, remove_id())
      .toArray();

    return res.status(200).json({ ok: true, products: productsCollection });
  } catch (err) {
    return res.status(404).json({ err, ok: false, message: err.message });
  } finally {
    return disconnectFromMongo();
  }
});

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

//PRODUCTS
