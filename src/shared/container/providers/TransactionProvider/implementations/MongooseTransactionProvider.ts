import mongoose from 'mongoose';
import ITransactionProvider, {
  SessionWorkflow,
} from '../models/ITransactionProvider';

export default class MongooseTransactionProvider
  implements ITransactionProvider {
  public async startSession<T>(
    sessionWorkflow: SessionWorkflow<T>,
  ): Promise<T> {
    let result: T;

    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      result = await sessionWorkflow(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return result;
  }
}
