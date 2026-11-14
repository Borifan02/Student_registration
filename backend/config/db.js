const mongoose = require('mongoose');
const path = require('path');

let mongodInstance = null;

// Ensure local compatible OpenSSL libs are in LD_LIBRARY_PATH for non-AVX embedded mongo
const libsDir = path.resolve(__dirname, '../libs');
if (!process.env.LD_LIBRARY_PATH || !process.env.LD_LIBRARY_PATH.includes(libsDir)) {
  process.env.LD_LIBRARY_PATH = `${libsDir}:${process.env.LD_LIBRARY_PATH || ''}`;
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_registration';
  
  try {
    // Attempt standard connection with 2s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to database at: ${uri}`);
    return uri;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to external MongoDB at ${uri} (${err.message}).`);
    console.log(`[MongoDB] Initializing embedded MongoDB server for instant zero-config operation...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      // Using 4.4.29 ensures compatibility across all CPU architectures (with or without AVX)
      mongodInstance = await MongoMemoryServer.create({
        binary: {
          version: '4.4.29',
        },
      });
      const memUri = mongodInstance.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Successfully connected to embedded MongoDB instance at: ${memUri}`);
      return memUri;
    } catch (innerErr) {
      console.error('[MongoDB] Fatal: Failed to initialize embedded MongoDB:', innerErr);
      throw innerErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      console.log('[MongoDB] Embedded MongoDB instance stopped cleanly.');
    }
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
