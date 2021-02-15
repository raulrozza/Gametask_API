export type SessionWorkflow = (session: object) => Promise<void>;

export default interface ITransactionProvider {
  startSession: (sessionWorkflow: SessionWorkflow) => Promise<void>;
}
