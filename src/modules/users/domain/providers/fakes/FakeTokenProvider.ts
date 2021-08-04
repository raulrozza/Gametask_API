import ITokenProvider from '@modules/users/domain/providers/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
  public async verify<T = unknown>(token: string): Promise<T> {
    return JSON.parse(token);
  }

  public async sign(payload: unknown): Promise<string> {
    return JSON.stringify(payload);
  }
}
