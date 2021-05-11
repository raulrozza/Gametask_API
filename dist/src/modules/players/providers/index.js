"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const repositories_1 = require("@modules/players/infra/mongoose/repositories");
tsyringe_1.container.registerSingleton('FeedPostsRepository', repositories_1.FeedPostsRepository);
tsyringe_1.container.registerSingleton('LeaderboardsRepository', repositories_1.LeaderboardsRepository);
tsyringe_1.container.registerSingleton('PlayersRepository', repositories_1.PlayersRepository);
tsyringe_1.container.registerSingleton('UnlockAchievementRequestRepository', repositories_1.UnlockAchievementRequestRepository);
tsyringe_1.container.registerSingleton('CompleteActivityRequestRepository', repositories_1.CompleteActivityRequestRepository);
