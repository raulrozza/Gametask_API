"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class PlayerTitlesController {
    constructor() {
        this.update = async (request, response) => {
            const { titleId } = request.body;
            const { id: userId } = request.auth;
            const gameId = request.game;
            const { id: playerId } = request.params;
            const changeTitle = tsyringe_1.container.resolve(services_1.ChangeTitleService);
            const player = await changeTitle.execute({
                titleId,
                userId,
                gameId,
                playerId,
            });
            return response.status(201).json(player);
        };
    }
}
exports.default = PlayerTitlesController;
