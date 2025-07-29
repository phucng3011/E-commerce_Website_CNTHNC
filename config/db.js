const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri;

    if (process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    } else {
      mongoUri = process.env.MONGO_URI;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
