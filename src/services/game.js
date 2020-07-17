module.exports = async (req, res, next) => {
  try {
    const gameId = req.headers['x-game-id'];

    if (!gameId) throw new Error('Unindentified game');

    req.game = gameId;

    return next();
  } catch (error) {
    // Access Forbidden
    return res.status(403).json({ error: String(error) });
  }
};
