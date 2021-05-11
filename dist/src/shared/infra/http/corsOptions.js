"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("@config/environment"));
const whitelist = [environment_1.default.CORS_CONFIG];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log('Origin:', req.headers.origin);
    if (whitelist.indexOf(req.headers.origin) !== -1)
        corsOptions = { origin: true };
    // reflect (enable) the requested origin in the CORS response
    else
        corsOptions = { origin: false }; // disable CORS for this request
    callback(null, corsOptions); // callback expects two parameters: error and options
};
const corsOptions = environment_1.default.CORS_CONFIG ? corsOptionsDelegate : undefined;
exports.default = corsOptions;
