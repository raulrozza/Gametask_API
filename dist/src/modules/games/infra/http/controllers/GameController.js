"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/games/services");
class GameController {
    constructor() {
        this.index = async (request, response) => {
            const { id } = request.auth;
            const listGame = tsyringe_1.container.resolve(services_1.ListGamesService);
            const games = await listGame.execute(id);
            return response.json(games);
        };
        this.show = async (request, response) => {
            const { id } = request.auth;
            const gameId = request.game;
            const showGame = tsyringe_1.container.resolve(services_1.ShowGameService);
            const game = await showGame.execute({
                gameId,
                userId: id,
            });
            return response.json(game);
        };
        this.store = async (request, response) => {
            const { name, description } = request.body;
            const { id } = request.auth;
            const createGame = tsyringe_1.container.resolve(services_1.CreateGameService);
            const game = await createGame.execute({
                name,
                description,
                creatorId: id,
            });
            return response.status(201).json(game);
        };
        this.update = async (request, response) => {
            const { name, description, ranks, levelInfo, theme } = request.body;
            const { id } = request.auth;
            const gameId = request.game;
            const updateGame = tsyringe_1.container.resolve(services_1.UpdateGameService);
            const game = await updateGame.execute({
                adminId: id,
                id: gameId,
                name,
                description,
                theme,
                levelInfo,
                ranks,
            });
            return response.status(201).json(game);
        };
    }
}
exports.default = GameController;
