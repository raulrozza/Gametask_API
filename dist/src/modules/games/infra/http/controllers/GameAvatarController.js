"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/games/services");
class GameAvatarController {
    constructor() {
        this.update = async (request, response) => {
            const file = request.file;
            const gameId = request.game;
            const { id } = request.auth;
            const updateGameAvatar = tsyringe_1.container.resolve(services_1.UpdateGameAvatarService);
            const updatedGame = await updateGameAvatar.execute({
                filename: file.filename,
                id: gameId,
                userId: id,
            });
            return response.status(201).json(updatedGame);
        };
    }
}
exports.default = GameAvatarController;
