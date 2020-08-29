const { GameNotFoundError } = require('../utils/Errors');

module.exports = async (req, res, next) => {
  try {
    const gameId = req.headers['x-game-id'];

    if (!gameId) throw new GameNotFoundError('Unindentified game');

    req.game = gameId;

    return next();
  } catch (error) {
    if (error instanceof GameNotFoundError)
      return res.status(403).json({ error: 'Unauthorized access.' });
    else return res.status(500).json({ error: 'Unknown error' });
  }
};
