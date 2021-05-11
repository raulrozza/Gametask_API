"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class PlayerActivitiesController {
    constructor() {
        this.update = async (request, response) => {
            const { userId } = request.body;
            const { id: requestId } = request.params;
            const completeActivity = tsyringe_1.container.resolve(services_1.CompleteActivityService);
            await completeActivity.execute({
                userId,
                requestId,
            });
            return response.status(201).end();
        };
    }
}
exports.default = PlayerActivitiesController;
