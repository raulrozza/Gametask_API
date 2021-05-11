"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const resetMongoDatabase_1 = __importDefault(require("../helpers/resetMongoDatabase"));
const setEnvToTest_1 = require("../helpers/setEnvToTest");
const app_1 = __importDefault(require("@shared/infra/http/app"));
const mongoEntities = __importStar(require("@modules/users/infra/mongoose/entities"));
const FakeUser_1 = __importDefault(require("@modules/users/fakes/FakeUser"));
describe('Users', () => {
    beforeAll(async () => {
        setEnvToTest_1.setEnvToTest();
        const entitiesArray = Object.values(mongoEntities);
        await resetMongoDatabase_1.default(entitiesArray);
    });
    jest.setTimeout(10000);
    const myUser = new FakeUser_1.default();
    const auth = { token: undefined };
    it('should create a new user', async () => {
        const requestBody = {
            firstname: myUser.firstname,
            lastname: myUser.lastname,
            email: myUser.email,
            password: myUser.password,
        };
        const response = await supertest_1.default(app_1.default).post('/users/signup').send(requestBody);
        const resultUser = response.body;
        expect(resultUser).toHaveProperty('id');
        expect(resultUser.firstname).toBe(myUser.firstname);
        expect(resultUser.lastname).toBe(myUser.lastname);
        expect(resultUser.email).toBe(myUser.email);
        myUser.id = resultUser.id;
    });
    it('should login with the newly created user', async () => {
        const requestBody = {
            email: myUser.email,
            password: myUser.password,
        };
        const response = await supertest_1.default(app_1.default).post('/users/login').send(requestBody);
        const authResponse = response.body;
        expect(authResponse).toHaveProperty('token');
        auth.token = authResponse.token;
    });
    it('should retreive the logged users info', async () => {
        const response = await supertest_1.default(app_1.default)
            .get(`/users/${myUser.id}`)
            .set('authorization', `Bearer ${auth.token}`);
        const user = response.body;
        expect(user.firstname).toBe(myUser.firstname);
        expect(user.lastname).toBe(myUser.lastname);
        expect(user.email).toBe(myUser.email);
    });
    it('should update the user firstname and lastname', async () => {
        myUser.firstname = 'new name';
        myUser.lastname = 'new lastname';
        const requestBody = {
            firstname: myUser.firstname,
            lastname: myUser.lastname,
        };
        const response = await supertest_1.default(app_1.default)
            .put('/users')
            .set('authorization', `Bearer ${auth.token}`)
            .send(requestBody);
        const updatedUser = response.body;
        expect(updatedUser.firstname).toBe(myUser.firstname);
        expect(updatedUser.lastname).toBe(myUser.lastname);
    });
});
