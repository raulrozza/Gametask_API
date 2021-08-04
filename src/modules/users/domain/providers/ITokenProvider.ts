export default interface ITokenProvider {
  verify<T = unknown>(token: string): Promise<T | null>;
  sign(payload: unknown): Promise<string>;
}
