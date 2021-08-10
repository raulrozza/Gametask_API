import ITransactionProvider, { SessionWorkflow } from '../ITransactionProvider';

export default class FakeTransactionProvider implements ITransactionProvider {
  public async startSession<T>(
    sessionWorkflow: SessionWorkflow<T>,
  ): Promise<T> {
    return sessionWorkflow({});
  }
}
