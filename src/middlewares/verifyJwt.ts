import jwt from 'jsonwebtoken';
import config from 'config/environment';
import { IAuth, NextFunction, Request, Response } from 'express';

// TOKEN FORMAT
// Authorization: Bearer <access_token>

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) throw new jwt.JsonWebTokenError('Invalid token');

    // Splits token on space due to its format
    const [, token] = header.split(' ');

    const auth = await jwt.verify(token, String(config.SECRET_KEY));

    req.auth = auth as IAuth;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      return res.status(403).json({ error: 'Unauthorized access.' });
    else return res.status(500).json({ error: 'Unknown error' });
  }
};
