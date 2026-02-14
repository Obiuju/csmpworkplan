const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);

  const db = client.db(process.env.DB_NAME || 'csmpworkplan');
  cachedDb = db;
  return db;
}

module.exports = { connectToDatabase };
