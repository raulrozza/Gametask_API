"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class PlayersController {
    constructor() {
        this.index = async (request, response) => {
            const { id } = request.auth;
            const listPlayers = tsyringe_1.container.resolve(services_1.ListPlayersService);
            const players = await listPlayers.execute(id);
            return response.json(players);
        };
        this.show = async (request, response) => {
            const { id: userId } = request.auth;
            const gameId = request.game;
            const { id } = request.params;
            const showPlayer = tsyringe_1.container.resolve(services_1.ShowPlayerService);
            const player = await showPlayer.execute({ id, userId, gameId });
            return response.json(player);
        };
        this.store = async (request, response) => {
            const { id } = request.auth;
            const gameId = request.game;
            const createPlayer = tsyringe_1.container.resolve(services_1.CreatePlayerService);
            const player = await createPlayer.execute({ gameId, userId: id });
            return response.status(201).json(player);
        };
    }
}
exports.default = PlayersController;
