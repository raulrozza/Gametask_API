"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("@config/upload"));
class DiskStorageProvider {
    async saveFile(filename, filefolder) {
        await fs_1.default.promises.rename(path_1.default.resolve(upload_1.default.tmpPath, filename), path_1.default.resolve(upload_1.default.uploadsPath, filefolder, filename));
        return filename;
    }
    async deleteFile(filename, filefolder) {
        const filePath = path_1.default.resolve(upload_1.default.uploadsPath, filefolder, filename);
        try {
            await fs_1.default.promises.stat(filePath);
        }
        catch (_a) {
            return;
        }
        await fs_1.default.promises.unlink(filePath);
    }
}
exports.default = DiskStorageProvider;
