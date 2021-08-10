import bcrypt from 'bcryptjs';

import IHashProvider from '@modules/users/domain/providers/IHashProvider';

const BCRYPT_SALT_ROUNDS = 12;

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashed = await bcrypt.hash(payload, BCRYPT_SALT_ROUNDS);

    return hashed;
  }

  public async compareHash(payload: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(payload, hash);

    return result;
  }
}
