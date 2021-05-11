"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeTokenProvider {
    async verify(token) {
        return JSON.parse(token);
    }
    async sign(payload) {
        return JSON.stringify(payload);
    }
}
exports.default = FakeTokenProvider;
