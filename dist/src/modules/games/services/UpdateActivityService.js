"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
let UpdateActivityService = class UpdateActivityService {
    constructor(activitiesRepository) {
        this.activitiesRepository = activitiesRepository;
        this.originalActivity = {};
    }
    async execute({ gameId, userId, id, name, experience, description, dmRules, }) {
        try {
            const foundActivity = await this.findOriginalActivity(id, gameId);
            if (!foundActivity)
                throw new implementations_1.RequestError('This activity does not exist', errorCodes_1.default.RESOURCE_NOT_FOUND, 400);
            const newActivityLog = this.generateActivityLog(userId, {
                name,
                description,
                dmRules,
                experience,
            });
            const updatedActivity = await this.activitiesRepository.update({
                id: this.originalActivity.id,
                name,
                experience,
                description,
                dmRules,
                changelog: [newActivityLog],
                game: this.originalActivity.game,
                history: [],
            });
            return updatedActivity;
        }
        catch (error) {
            if (error instanceof implementations_1.RequestError)
                throw error;
            throw new implementations_1.RequestError(error.message, errorCodes_1.default.INTERNAL_SERVER_ERROR, 500);
        }
    }
    async findOriginalActivity(activityId, gameId) {
        const activity = await this.activitiesRepository.findOne(activityId, gameId);
        if (activity)
            this.originalActivity = activity;
        return Boolean(activity);
    }
    generateActivityLog(userId, newActivity) {
        const changes = this.getChanges(newActivity);
        const logVersion = this.originalActivity.changelog[0]
            ? this.originalActivity.changelog[0].version + 1
            : 1;
        const activityLog = {
            version: logVersion,
            log: new Date(),
            changes,
            userId,
        };
        return activityLog;
    }
    getChanges(newActivity) {
        const changes = {};
        if (newActivity.name !== this.originalActivity.name)
            changes.name = newActivity.name;
        if (newActivity.description !== this.originalActivity.description)
            changes.description = newActivity.description;
        if (newActivity.experience !== this.originalActivity.experience)
            changes.experience = newActivity.experience;
        if (newActivity.dmRules !== this.originalActivity.dmRules)
            changes.dmRules = newActivity.dmRules;
        return changes;
    }
};
UpdateActivityService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('ActivitiesRepository')),
    __metadata("design:paramtypes", [Object])
], UpdateActivityService);
exports.default = UpdateActivityService;
