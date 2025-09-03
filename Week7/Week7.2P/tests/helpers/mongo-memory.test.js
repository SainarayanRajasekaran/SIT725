const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function startInMemoryMongo() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: 'myprojectDB' });
  return uri;
}

async function stopInMemoryMongo() {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) await mongod.stop();
}

async function clearDB() {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

module.exports = { startInMemoryMongo, stopInMemoryMongo, clearDB };
