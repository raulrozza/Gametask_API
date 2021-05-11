"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploadsPath = path_1.default.resolve(__dirname, '..', '..', 'uploads');
const tmpPath = path_1.default.resolve(__dirname, '..', '..', 'tmp');
exports.default = {
    uploadsPath,
    tmpPath,
    multerConfig: {
        storage: multer_1.default.diskStorage({
            destination: (req, _, cb) => cb(null, tmpPath),
            filename: (_, file, cb) => {
                const ext = path_1.default.extname(file.originalname);
                const name = path_1.default.basename(file.originalname, ext);
                const spacedStrippedName = name.replace(/ /, '_');
                cb(null, `${spacedStrippedName}-${Date.now()}${ext}`);
            },
        }),
    },
};
