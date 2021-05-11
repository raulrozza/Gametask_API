"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/users/services");
class UsersController {
    constructor() {
        this.index = async (_, response) => {
            const listUsers = tsyringe_1.container.resolve(services_1.ListUsersService);
            const users = await listUsers.execute();
            return response.json(users);
        };
        this.show = async (request, response) => {
            const { id } = request.params;
            const showUsers = tsyringe_1.container.resolve(services_1.ShowUsersService);
            const user = await showUsers.execute(id);
            return response.json(user);
        };
        this.store = async (request, response) => {
            const { firstname, lastname, email, password } = request.body;
            const createUser = tsyringe_1.container.resolve(services_1.CreateUsersService);
            const user = await createUser.execute({
                firstname,
                lastname,
                email,
                password,
            });
            return response.status(201).json(user);
        };
        this.update = async (request, response) => {
            const { firstname, lastname } = request.body;
            const { id } = request.auth;
            const updateUser = tsyringe_1.container.resolve(services_1.UpdateUserService);
            const user = await updateUser.execute({ firstname, lastname, id });
            return response.status(201).json(user);
        };
    }
}
exports.default = UsersController;
