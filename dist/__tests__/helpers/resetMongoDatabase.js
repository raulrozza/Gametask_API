"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function resetMongoDatabase(models) {
    await Promise.all(models.map(model => model.deleteMany()));
}
exports.default = resetMongoDatabase;
