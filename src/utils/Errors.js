const errorCodes = {
  USER_ALREADY_EXISTS: 100,
  USER_PASSWORD_DONT_MATCH: 200,
};

class GameNotFoundError extends Error {}

class UserExistsError extends Error {}

class BadAuthenticationError extends Error {}

module.exports = {
  errorCodes,
  GameNotFoundError,
  UserExistsError,
  BadAuthenticationError,
};
