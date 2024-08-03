const { MongoClient } = require('mongodb');

const { CONNECTION_STRING, DB_NAME } = require('dotenv').config().parsed;

// CONECTING KEPT OPEN
/* const dbConnection = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log('DB online');
  } catch (error) {
    console.log(error);
    throw new Error('Error iniciando DB');
  }
};
module.exports = { dbConnection }; */
// CONECTING KEPT OPEN

const client = new MongoClient(CONNECTION_STRING);
const connectToMongo = async () => {
  let connection = null;
  try {
    connection = await client.connect();
  } catch (err) {
    console.log(err.message);
  }
  return connection;
};

const disconnectFromMongo = async () => {
  try {
    await client.close();
    console.log('disconnect');
  } catch (error) {
    console.log(error.message);
  }
};

const connectToCollection = async (colName) => {
  try {
    const connection = await connectToMongo(colName);
    const db = connection.db(DB_NAME);
    const collection = db.collection(colName);
    return collection;
  } catch (error) {
    console.log(err);
    return null;
  }
};

module.exports = { connectToCollection, disconnectFromMongo };
