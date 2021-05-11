"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakeUser {
    constructor() {
        this.id = '';
        this.firstname = faker_1.default.name.firstName();
        this.lastname = faker_1.default.name.lastName();
        this.email = faker_1.default.internet.email();
        this.password = faker_1.default.internet.password(6);
    }
}
exports.default = FakeUser;
