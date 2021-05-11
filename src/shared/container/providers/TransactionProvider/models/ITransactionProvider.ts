export type SessionWorkflow<T> = (session: object) => Promise<T>;

export default interface ITransactionProvider {
  startSession: <T>(sessionWorkflow: SessionWorkflow<T>) => Promise<T>;
}
