"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvToTest = void 0;
const setEnvToTest = () => {
    const OLD_ENV = process.env.NODE_ENV;
    process.env = Object.assign(Object.assign({}, process.env), { NODE_ENV: 'test' });
    return OLD_ENV;
};
exports.setEnvToTest = setEnvToTest;
