"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FakeUsersRepository {
    constructor() {
        this.users = [];
    }
    async findAll() {
        return Promise.resolve(this.users);
    }
    async findOne(id) {
        const foundUser = this.users.find(user => user.id === id);
        return Promise.resolve(foundUser);
    }
    async findOneByEmail(email) {
        const foundUser = this.users.find(user => user.email === email);
        return Promise.resolve(foundUser);
    }
    async create(user) {
        user.id = uuid_1.v4();
        this.users.push(user);
        return Promise.resolve(user);
    }
    async update(_a) {
        var { id } = _a, user = __rest(_a, ["id"]);
        const foundIndex = this.users.findIndex(storedUser => storedUser.id === id);
        const foundUser = this.users[foundIndex];
        const updatedUser = Object.assign(Object.assign({}, foundUser), user);
        this.users[foundIndex] = updatedUser;
        return updatedUser;
    }
}
exports.default = FakeUsersRepository;
