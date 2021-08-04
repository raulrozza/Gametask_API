import jwt from 'jsonwebtoken';

import envs from '@config/environment';

import ITokenProvider from '@modules/users/domain/providers/ITokenProvider';

const VALID_DAYS = 7;
const EXPIRES_IN = VALID_DAYS * 86400;

export default class JwtTokenProvider implements ITokenProvider {
  async verify<T = unknown>(token: string): Promise<T | null> {
    try {
      const result = await jwt.verify(token, String(envs.SECRET_KEY));

      return (result as unknown) as T;
    } catch {
      return null;
    }
  }

  async sign(payload: unknown): Promise<string> {
    const token = await jwt.sign(
      payload as string | object,
      String(envs.SECRET_KEY),
      {
        expiresIn: EXPIRES_IN,
      },
    );

    return token;
  }
}
