"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const setEnvToTest_1 = require("../helpers/setEnvToTest");
const app_1 = __importDefault(require("@shared/infra/http/app"));
describe('Booting', () => {
    beforeAll(() => {
        setEnvToTest_1.setEnvToTest();
    });
    it('should receive the hello message from the api', async () => {
        const response = await supertest_1.default(app_1.default).get('/');
        expect(response.body).toHaveProperty('message');
    });
    it('should get a 404 message when trying to access an non existing resource', async () => {
        const response = await supertest_1.default(app_1.default).get('/this-resource-does-not-exist');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
});
