"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const mongoose_1 = __importDefault(require("mongoose"));
class MongooseTransactionProvider {
    async startSession(sessionWorkflow) {
        const result = { data: null };
        const session = await mongoose_1.default.startSession();
        let errorHappened = false;
        try {
            await session.startTransaction();
            result.data = await sessionWorkflow(session);
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            console.error(error);
            errorHappened = true;
        }
        finally {
            await session.endSession();
        }
        if (errorHappened)
            throw new implementations_1.RequestError('An unknown error ocurred', errorCodes_1.default.INTERNAL_SERVER_ERROR, 500);
        return result.data;
    }
}
exports.default = MongooseTransactionProvider;
