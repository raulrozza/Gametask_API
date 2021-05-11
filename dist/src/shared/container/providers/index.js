"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const DiskStorageProvider_1 = __importDefault(require("./StorageProvider/implementations/DiskStorageProvider"));
const MongooseTransactionProvider_1 = __importDefault(require("./TransactionProvider/implementations/MongooseTransactionProvider"));
tsyringe_1.container.registerSingleton('StorageProvider', DiskStorageProvider_1.default);
tsyringe_1.container.registerSingleton('TransactionProvider', MongooseTransactionProvider_1.default);
