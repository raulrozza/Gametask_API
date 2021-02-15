import mongoose from 'mongoose';
import ITransactionProvider, {
  SessionWorkflow,
} from '../models/ITransactionProvider';

export default class MongooseTransactionProvider
  implements ITransactionProvider {
  public async startSession(sessionWorkflow: SessionWorkflow): Promise<void> {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      await sessionWorkflow(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
