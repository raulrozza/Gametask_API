"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeStorageProvider {
    constructor() {
        this.storedFiles = [];
    }
    saveFile(file) {
        this.storedFiles.push(file);
        return Promise.resolve(file);
    }
    deleteFile(file) {
        const foundIndex = this.storedFiles.findIndex(storedFile => storedFile === file);
        this.storedFiles.splice(foundIndex, 1);
        return Promise.resolve();
    }
}
exports.default = FakeStorageProvider;
