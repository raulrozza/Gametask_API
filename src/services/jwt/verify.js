const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../../config');

// TOKEN FORMAT
// Authorization: Bearer <access_token>

module.exports = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) throw 'Invalid token';

    // Splits token on space due to its format
    const bearer = bearerHeader.split(' ');
    // Gets token from the array
    const bearerToken = bearer[1];
    const auth = await jwt.verify(bearerToken, SECRET_KEY);

    res.auth = auth;

    return next();
  } catch (error) {
    // Access Forbidden
    return res.status(403).json({ error: String(error) });
  }
};
