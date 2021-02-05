import bcrypt from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

const BCRYPT_SALT_ROUNDS = 12;

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashed = await bcrypt.hash(payload, BCRYPT_SALT_ROUNDS);

    return hashed;
  }
}
