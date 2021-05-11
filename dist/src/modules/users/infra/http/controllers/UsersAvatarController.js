"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@modules/users/services");
const tsyringe_1 = require("tsyringe");
class UsersAvatarController {
    constructor() {
        this.update = async (request, response) => {
            const file = request.file;
            const { id } = request.auth;
            const updateUserAvatar = tsyringe_1.container.resolve(services_1.UpdateUserAvatarService);
            const updatedUser = await updateUserAvatar.execute({
                filename: file.filename,
                id,
            });
            return response.status(201).json(updatedUser);
        };
    }
}
exports.default = UsersAvatarController;
