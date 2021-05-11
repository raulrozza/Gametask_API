import { Model } from 'mongoose';

export default async function resetMongoDatabase(
  models: Model<any>[],
): Promise<void> {
  await Promise.all(models.map(model => model.deleteMany()));
}
