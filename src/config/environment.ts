import dotenv from 'dotenv';

const envPaths: Record<string, string> = {
  test: '.env.test',
  production: '.env.production',
  development: '.env',
};

dotenv.config({ path: envPaths[process.env.NODE_ENV || 'development'] });

export default {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URL: process.env.MONGO_URL,
  CORS_CONFIG: process.env.CORS_CONFIG,
  ADDRESS: process.env.ADDRESS,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
};
