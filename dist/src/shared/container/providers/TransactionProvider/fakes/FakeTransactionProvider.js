"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeTransactionProvider {
    async startSession(sessionWorkflow) {
        return sessionWorkflow({});
    }
}
exports.default = FakeTransactionProvider;
