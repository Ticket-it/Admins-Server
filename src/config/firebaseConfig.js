/**
 * Important requires
 */
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

/**
 * Declare config
 */
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(config);
const database = getDatabase(app);

// Export database
module.exports = { database };