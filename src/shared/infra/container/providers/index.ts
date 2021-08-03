import MongooseTransactionProvider from '@shared/infra/container/providers/MongooseTransactionProvider';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import { container } from 'tsyringe';

container.registerSingleton<ITransactionProvider>(
  'TransactionProvider',
  MongooseTransactionProvider,
);
