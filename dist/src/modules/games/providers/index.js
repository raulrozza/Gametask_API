"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const repositories_1 = require("@modules/games/infra/mongoose/repositories");
tsyringe_1.container.registerSingleton('AchievementsRepository', repositories_1.AchievementsRepository);
tsyringe_1.container.registerSingleton('ActivitiesRepository', repositories_1.ActivitiesRepository);
tsyringe_1.container.registerSingleton('GamesRepository', repositories_1.GamesRepository);
tsyringe_1.container.registerSingleton('TitlesRepository', repositories_1.TitlesRepository);
