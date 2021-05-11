"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const services_1 = require("@modules/games/services");
const implementations_1 = require("@shared/errors/implementations");
class TitleController {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const { name } = request.query;
            const listTitles = tsyringe_1.container.resolve(services_1.ListTitlesService);
            const titles = name && typeof name === 'string'
                ? await listTitles.execute({ gameId, name })
                : await listTitles.execute({ gameId });
            return response.json(titles);
        };
        this.remove = async (request, response) => {
            const gameId = request.game;
            const { id } = request.params;
            if (!id)
                throw new implementations_1.RequestError('Missing id in params', errorCodes_1.default.MISSING_PARAMETERS);
            const deleteTitle = tsyringe_1.container.resolve(services_1.DeleteTitleService);
            await deleteTitle.execute({ gameId, titleId: id });
            return response.status(201).end();
        };
        this.store = async (request, response) => {
            const { name } = request.body;
            const gameId = request.game;
            const createTitle = tsyringe_1.container.resolve(services_1.CreateTitleService);
            const title = await createTitle.execute({ name, game: gameId });
            return response.status(201).json(title);
        };
        this.update = async (request, response) => {
            const { name } = request.body;
            const gameId = request.game;
            const { id } = request.params;
            if (!id)
                throw new implementations_1.RequestError('Missing id in params', errorCodes_1.default.MISSING_PARAMETERS);
            const updateTitle = tsyringe_1.container.resolve(services_1.UpdateTitleService);
            const title = await updateTitle.execute({ id, name, gameId });
            return response.status(201).json(title);
        };
    }
}
exports.default = TitleController;
