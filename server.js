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
const remove_id = require('./utils/remove_id');
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const env = require('dotenv').config();
const { PORT } = env.parsed;
console.log(PORT);
server.use(cors());

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ ok: true });
});
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

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
