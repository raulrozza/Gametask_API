"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const services_1 = require("@modules/games/services");
class ActivityReport {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const listActivities = tsyringe_1.container.resolve(services_1.ListActivitiesService);
            const activities = await listActivities.execute(gameId);
            return response.json(activities);
        };
        this.remove = async (request, response) => {
            const { id } = request.params;
            const gameId = request.game;
            if (!id)
                throw new implementations_1.RequestError('Missing activity id on params.', errorCodes_1.default.MISSING_PARAMETERS);
            const deleteActivity = tsyringe_1.container.resolve(services_1.DeleteActivityService);
            await deleteActivity.execute({ gameId, activityId: id });
            return response.status(201).end();
        };
        this.show = async (request, response) => {
            const { id } = request.params;
            const gameId = request.game;
            if (!id)
                throw new implementations_1.RequestError('Missing activity id on params.', errorCodes_1.default.MISSING_PARAMETERS);
            const showActivity = tsyringe_1.container.resolve(services_1.ShowActivityService);
            const activity = await showActivity.execute({ gameId, activityId: id });
            return response.json(activity);
        };
        this.store = async (request, response) => {
            const { name, description, experience, dmRules } = request.body;
            const gameId = request.game;
            const createActivity = tsyringe_1.container.resolve(services_1.CreateActivityService);
            const activity = await createActivity.execute({
                gameId,
                name,
                experience,
                description,
                dmRules,
            });
            return response.status(201).json(activity);
        };
        this.update = async (request, response) => {
            const { name, description, experience, dmRules } = request.body;
            const gameId = request.game;
            const { id } = request.params;
            const { id: userId } = request.auth;
            const updateActivity = tsyringe_1.container.resolve(services_1.UpdateActivityService);
            const activity = await updateActivity.execute({
                gameId,
                userId,
                id,
                name,
                description,
                experience,
                dmRules,
            });
            return response.status(201).json(activity);
        };
    }
}
exports.default = ActivityReport;
