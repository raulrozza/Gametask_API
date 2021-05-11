"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const verifyGameSelected = async (request, _, next) => {
    const gameId = request.headers['x-game-id'];
    if (!gameId)
        throw new implementations_1.RequestError('You need to select a game to access this resource', errorCodes_1.default.INVALID_TOKEN, 403);
    if (!mongoose_1.isValidObjectId(gameId))
        throw new implementations_1.RequestError('Invalid game id', errorCodes_1.default.INVALID_ID);
    request.game = String(gameId);
    return next();
};
exports.default = verifyGameSelected;
