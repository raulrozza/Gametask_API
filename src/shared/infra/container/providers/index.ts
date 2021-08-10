import { container } from 'tsyringe';

import upload from '@config/upload';
import IStorageProvider from '@shared/domain/providers/IStorageProvider';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import DiskStorageProvider from '@shared/infra/container/providers/DiskStorageProvider';
import MongooseTransactionProvider from '@shared/infra/container/providers/MongooseTransactionProvider';
import S3StorageProvider from '@shared/infra/container/providers/S3StorageProvider';

const storageProviders = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviders[upload.storageDriver],
);

container.registerSingleton<ITransactionProvider>(
  'TransactionProvider',
  MongooseTransactionProvider,
);
