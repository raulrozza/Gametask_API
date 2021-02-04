import { CorsOptionsDelegate } from 'cors';

import envs from '@config/environment';

const whitelist = [envs.CORS_CONFIG];

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  let corsOptions;

  console.log('Origin:', req.headers.origin);

  if (whitelist.indexOf(req.headers.origin) !== -1)
    corsOptions = { origin: true };
  // reflect (enable) the requested origin in the CORS response
  else corsOptions = { origin: false }; // disable CORS for this request

  callback(null, corsOptions); // callback expects two parameters: error and options
};

const corsOptions = envs.CORS_CONFIG ? corsOptionsDelegate : undefined;

export default corsOptions;
