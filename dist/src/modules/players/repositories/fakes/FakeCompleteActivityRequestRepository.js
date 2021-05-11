"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FakeCompleteActivityRequestRepository {
    constructor() {
        this.completeActivityRequests = [];
    }
    async findAllFromGame(gameId) {
        return this.completeActivityRequests.filter(request => request.game === gameId);
    }
    async findOne(id) {
        return this.completeActivityRequests.find(request => request.id === id);
    }
    async create(request) {
        const newRequest = Object.assign({ id: uuid_1.v4() }, request);
        this.completeActivityRequests.push(newRequest);
        return Promise.resolve(newRequest);
    }
    async delete(id, gameId) {
        const foundIndex = this.completeActivityRequests.findIndex(request => request.id === id && request.game === gameId);
        this.completeActivityRequests.splice(foundIndex, 1);
    }
}
exports.default = FakeCompleteActivityRequestRepository;
