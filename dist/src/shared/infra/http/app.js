"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
// Config
const corsOptions_1 = __importDefault(require("@shared/infra/http/corsOptions"));
// Routes
const routes_1 = __importDefault(require("./routes"));
require("@shared/infra/mongoose");
require("@shared/container");
// Initial server configuration
const app = express_1.default();
app.use(cors_1.default(corsOptions_1.default));
app.use(express_1.default.json());
app.use(routes_1.default);
exports.default = app;
