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
const remove_id = require('./src/utils/remove_id');
const { validateRequest, schema } = require('./src/middlewares/validation');
const User = require('./src/models/User');
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
server.post('/users', validateRequest(schema), async (req, res) => {
  const { name, lastName, email, password } = req.body;
  try {
    const users = await connectToCollection('users');
    console.log('req body', req.body);
    const newUser = new User({ name, lastName, email, password });
    // const saveUserOperation = await newUser.save();
    const insertNewUser = await users.insertOne(newUser);
    console.log('saving ');
    return res.status(201).json({ ok: true, message: 'user created' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  } finally {
    return disconnectFromMongo();
  }
  // try {
  //   const users = await connectToCollection('users');
  //   const usersCollection = await users.find({}, remove_id()).toArray();

  //   return res.status(200).json({ ok: true, users: usersCollection });
  // } catch (err) {
  //   return res.status(404).json({ err, ok: false });
  // } finally {
  //   return disconnectFromMongo();
  // }
});

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

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

//PRODUCTS
