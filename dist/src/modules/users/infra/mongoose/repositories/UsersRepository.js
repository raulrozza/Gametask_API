"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const entities_1 = require("@modules/users/infra/mongoose/entities");
class UsersRepository {
    async findAll() {
        const users = await entities_1.User.find({}, { password: 0 });
        return users;
    }
    async findOne(id) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        const user = await entities_1.User.findOne({ _id: id }, { password: 0 });
        return user || undefined;
    }
    async findOneByEmail(email) {
        const user = await entities_1.User.findOne({ email });
        return user || undefined;
    }
    async create({ firstname, lastname, email, password, }) {
        const createdUser = await entities_1.User.create({
            firstname,
            lastname,
            email,
            password,
        });
        return createdUser;
    }
    async update({ id, firstname, lastname, image, }) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        const updatedUser = await entities_1.User.findByIdAndUpdate(id, {
            $set: {
                firstname,
                lastname,
                image,
            },
        }, { new: true });
        return updatedUser;
    }
}
exports.default = UsersRepository;
