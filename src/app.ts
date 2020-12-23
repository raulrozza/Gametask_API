import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors, { CorsOptionsDelegate } from 'cors';

// Environment variables
import config from 'config/environment';

// Routes
import achievementRoutes from 'routes/achievements.routes.js';
import achievementRegisterRoutes from 'routes/achievementRegister.routes';
import activityRoutes from 'routes/activities.routes.js';
import activityRegisterRoutes from 'routes/activityRegister.routes.js';
import achievementUnlockerRoutes from 'routes/achievementUnlocker.routes';
import authenticationRoutes from 'routes/authentication.routes.js';
import experienceRoutes from 'routes/experience.routes.js';
import feedRoutes from 'routes/feed.routes.js';
import gameRoutes from 'routes/games.routes';
import gameplayRoutes from 'routes/gameplay.routes';
import rankRoutes from 'routes/ranks.routes';
import levelRoutes from 'routes/levels.routes';
import userRoutes from 'routes/users.routes';
import titleRoutes from 'routes/titles.routes';
import playerRoutes from 'routes/players.routes';
import inviteRoutes from 'routes/invite.routes';

// Initial server configuration
const app = express();

mongoose
  .connect(String(config.MONGO_URL), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .catch(error => console.error('MongoDB error:', error));

const whitelist = [config.CORS_CONFIG];

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  let corsOptions;

  console.log('Origin:', req.headers.origin);

  if (whitelist.indexOf(req.headers.origin) !== -1)
    corsOptions = { origin: true };
  // reflect (enable) the requested origin in the CORS response
  else corsOptions = { origin: false }; // disable CORS for this request

  callback(null, corsOptions); // callback expects two parameters: error and options
};

const corsOptions = config.CORS_CONFIG ? corsOptionsDelegate : undefined;

app.use(cors(corsOptions));

app.use(express.json());

// Static routes
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

// Routes
app.use('/achievement', achievementRoutes);
app.use('/achievementRegister', achievementRegisterRoutes);
app.use('/unlockAchievement', achievementUnlockerRoutes);
app.use('/activity', activityRoutes);
app.use('/activityRegister', activityRegisterRoutes);
app.use('/experience', experienceRoutes);
app.use('/feed', feedRoutes);
app.use('/game', gameRoutes);
app.use('/gameplay', gameplayRoutes);
app.use('/invite', inviteRoutes);
app.use('/login', authenticationRoutes);
app.use('/rank', rankRoutes);
app.use('/level', levelRoutes);
app.use('/player', playerRoutes);
app.use('/user', userRoutes);
app.use('/title', titleRoutes);

export default app;
