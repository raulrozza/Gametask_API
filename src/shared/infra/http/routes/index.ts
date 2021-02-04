import express from 'express';
import { resolve } from 'path';

// Routes
import achievementRegisterRoutes from '@routes/achievementRegister.routes';
import achievementRoutes from '@routes/achievements.routes';
import achievementUnlockerRoutes from '@routes/achievementUnlocker.routes';
import activityRoutes from '@routes/activities.routes';
import activityRegisterRoutes from '@routes/activityRegister.routes';
import authenticationRoutes from '@routes/authentication.routes';
import experienceRoutes from '@routes/experience.routes';
import feedRoutes from '@routes/feed.routes';
import gameplayRoutes from '@routes/gameplay.routes';
import gameRoutes from '@routes/games.routes';
import inviteRoutes from '@routes/invite.routes';
import levelRoutes from '@routes/levels.routes';
import playerRoutes from '@routes/players.routes';
import rankRoutes from '@routes/ranks.routes';
import titleRoutes from '@routes/titles.routes';
import userRoutes from '@routes/users.routes';

const appRoutes = express.Router();

// Static routes
appRoutes.use('/files', express.static(resolve(__dirname, '..', 'uploads')));

// Routes
appRoutes.use('/achievement', achievementRoutes);
appRoutes.use('/achievementRegister', achievementRegisterRoutes);
appRoutes.use('/unlockAchievement', achievementUnlockerRoutes);
appRoutes.use('/activity', activityRoutes);
appRoutes.use('/activityRegister', activityRegisterRoutes);
appRoutes.use('/experience', experienceRoutes);
appRoutes.use('/feed', feedRoutes);
appRoutes.use('/game', gameRoutes);
appRoutes.use('/gameplay', gameplayRoutes);
appRoutes.use('/invite', inviteRoutes);
appRoutes.use('/login', authenticationRoutes);
appRoutes.use('/rank', rankRoutes);
appRoutes.use('/level', levelRoutes);
appRoutes.use('/player', playerRoutes);
appRoutes.use('/user', userRoutes);
appRoutes.use('/title', titleRoutes);

export default appRoutes;
