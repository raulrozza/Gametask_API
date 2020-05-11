const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URL: process.env.MONGO_URL,
  CORS_CONFIG: process.env.CORS_CONFIG,
};