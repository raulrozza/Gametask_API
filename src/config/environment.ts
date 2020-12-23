import dotenv from 'dotenv'
dotenv.config();

export default {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URL: process.env.MONGO_URL,
  CORS_CONFIG: process.env.CORS_CONFIG,
  ADDRESS: process.env.ADDRESS,
};
