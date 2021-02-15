import ITransactionProvider, {
  SessionWorkflow,
} from '../models/ITransactionProvider';

export default class FakeTransactionProvider implements ITransactionProvider {
  public async startSession(sessionWorkflow: SessionWorkflow): Promise<void> {
    sessionWorkflow({});
  }
}
