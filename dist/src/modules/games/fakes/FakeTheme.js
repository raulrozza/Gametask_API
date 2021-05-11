"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakeTheme {
    constructor() {
        this.primary = faker_1.default.random.hexaDecimal(6);
        this.secondary = faker_1.default.random.hexaDecimal(6);
    }
}
exports.default = FakeTheme;
