const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Environment variables
const { MONGO_URL, CORS_CONFIG } = require('./config/environment');

// Routes
const achievementRoutes = require('./routes/achievements.routes.js');
const activityRoutes = require('./routes/activities.routes.js');
const activityRegisterRoutes = require('./routes/activityRegister.routes.js');
const authenticationRoutes = require('./routes/authentication.routes.js');
const experienceRoutes = require('./routes/experience.routes.js');
const feedRoutes = require('./routes/feed.routes.js');
const gameRoutes = require('./routes/games.routes');
const rankRoutes = require('./routes/ranks.routes');
const levelRoutes = require('./routes/levels.routes');
const userRoutes = require('./routes/users.routes');
const titleRoutes = require('./routes/titles.routes');
const playerRoutes = require('./routes/players.routes');

// Initial server configuration
const app = express();

mongoose
  .connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .catch(error => console.error('MongoDB error:', error));

const whitelist = [CORS_CONFIG];

const corsOptionsDelegate =
  CORS_CONFIG &&
  ((req, callback) => {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1)
      corsOptions = { origin: true };
    // reflect (enable) the requested origin in the CORS response
    else corsOptions = { origin: false }; // disable CORS for this request

    callback(null, corsOptions); // callback expects two parameters: error and options
  });

app.use(cors(corsOptionsDelegate));

app.use(express.json());

// Static routes
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

// Routes
app.use('/achievement', achievementRoutes);
app.use('/activity', activityRoutes);
app.use('/activityRegister', activityRegisterRoutes);
app.use('/login', authenticationRoutes);
app.use('/experience', experienceRoutes);
app.use('/feed', feedRoutes);
app.use('/game', gameRoutes);
app.use('/rank', rankRoutes);
app.use('/level', levelRoutes);
app.use('/player', playerRoutes);
app.use('/user', userRoutes);
app.use('/title', titleRoutes);

module.exports = app;