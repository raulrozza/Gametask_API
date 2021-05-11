"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@shared/infra/http/app"));
const environment_1 = __importDefault(require("@config/environment"));
app_1.default.listen(environment_1.default.PORT, () => console.log(`Server started on port ${environment_1.default.PORT}`));
