const errorCodes = {
  USER_ALREADY_EXISTS: 100,
  PLAYER_ALREADY_EXISTS: 101,
  USER_PASSWORD_DONT_MATCH: 200,
  MISSING_PARAMETERS: 300,
};

class BadAuthenticationError extends Error {}

class GameNotFoundError extends Error {}

class MissingParametersError extends Error {}

class UserExistsError extends Error {}

class PlayerExistsError extends Error {}

module.exports = {
  errorCodes,
  BadAuthenticationError,
  GameNotFoundError,
  MissingParametersError,
  PlayerExistsError,
  UserExistsError,
};
