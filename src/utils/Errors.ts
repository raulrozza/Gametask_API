export const errorCodes = {
  USER_ALREADY_EXISTS: 100,
  PLAYER_ALREADY_EXISTS: 101,
  ACHIEVEMENT_REGISTER_ALREADY_EXISTS: 102,
  BAD_REQUEST_ERROR: 103,
  USER_PASSWORD_DONT_MATCH: 200,
  TITLE_BELONGS_TO_PLAYER: 201,
  MISSING_PARAMETERS: 300,
};

export class BadAuthenticationError extends Error {}

export class BadRequestError extends Error {}

export class GameNotFoundError extends Error {}

export class MissingParametersError extends Error {}

export class UserExistsError extends Error {}

export class PlayerExistsError extends Error {}

export class AchievementRegisterExistsError extends Error {}

export class TitleBelongsToPlayerError extends Error {}
