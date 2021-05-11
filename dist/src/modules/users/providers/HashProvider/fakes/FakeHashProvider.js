"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeHashProvider {
    async generateHash(payload) {
        return Promise.resolve(payload);
    }
    async compareHash(payload, hash) {
        return Promise.resolve(payload === hash);
    }
}
exports.default = FakeHashProvider;
