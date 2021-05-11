"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class CompleteActivityRequestController {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const listCompleteActivityRequest = tsyringe_1.container.resolve(services_1.ListCompleteActivityRequestsService);
            const activityRequests = await listCompleteActivityRequest.execute(gameId);
            return response.json(activityRequests);
        };
        this.remove = async (request, response) => {
            const gameId = request.game;
            const { id } = request.params;
            const deleteCompleteActivityRequest = tsyringe_1.container.resolve(services_1.DeleteCompleteActivityRequestService);
            await deleteCompleteActivityRequest.execute({ requestId: id, gameId });
            return response.status(201).end();
        };
        this.store = async (request, response) => {
            const { activity, completionDate, information, requestDate } = request.body;
            const { id: requester } = request.params;
            const { id: userId } = request.auth;
            const gameId = request.game;
            const createCompleteActivityRequest = tsyringe_1.container.resolve(services_1.CreateCompleteActivityRequestService);
            const activityRequest = await createCompleteActivityRequest.execute({
                requester,
                userId,
                gameId,
                activity,
                completionDate,
                information,
                requestDate,
            });
            return response.status(201).json(activityRequest);
        };
    }
}
exports.default = CompleteActivityRequestController;
