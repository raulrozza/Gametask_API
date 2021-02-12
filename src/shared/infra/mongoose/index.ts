import mongoose from 'mongoose';

import envs from '@config/environment';

mongoose.connect(String(envs.MONGO_URL), {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
