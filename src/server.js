const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cors = require('cors');

const {
  connectToCollection,
  disconnectFromMongo,
} = require('../database/config');

const { dbConnection } = require('../database/config');
const Category = require('../models/Category');
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
    const categoriesCollection = await categories.find().toArray();
    console.log(categoriesCollection);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(404).json({ err, ok: false });
  } finally {
    return disconnectFromMongo();
  }
});

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
