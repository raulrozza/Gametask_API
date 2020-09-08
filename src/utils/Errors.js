const errorCodes = {
  USER_ALREADY_EXISTS: 100,
  PLAYER_ALREADY_EXISTS: 101,
  ACHIEVEMENT_REGISTER_ALREADY_EXISTS: 102,
  USER_PASSWORD_DONT_MATCH: 200,
  TITLE_BELONGS_TO_PLAYER: 201,
  MISSING_PARAMETERS: 300,
};

class BadAuthenticationError extends Error {}

class GameNotFoundError extends Error {}

class MissingParametersError extends Error {}

class UserExistsError extends Error {}

class PlayerExistsError extends Error {}

class AchievementRegisterExistsError extends Error {}

class TitleBelongsToPlayerError extends Error {}

module.exports = {
  errorCodes,
  AchievementRegisterExistsError,
  BadAuthenticationError,
  GameNotFoundError,
  MissingParametersError,
  PlayerExistsError,
  UserExistsError,
  TitleBelongsToPlayerError,
};
