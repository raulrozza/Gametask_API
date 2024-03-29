import environment from '@config/environment';
import upload from '@config/upload';
import IStorageProvider from '@shared/domain/providers/IStorageProvider';
import aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

export default class S3StorageProvider implements IStorageProvider {
  private client = new aws.S3({
    region: environment.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: String(environment.AWS_ACCESS_KEY),
      secretAccessKey: String(environment.AWS_SECRET_KEY),
    },
  });

  public async saveFile(file: string, filefolder: string): Promise<string> {
    const originalPath = path.resolve(upload.tmpPath, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    await this.client
      .putObject({
        Bucket: String(environment.AWS_BUCKET_NAME),
        Key: `${filefolder}/${file}`,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string, filefolder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: String(environment.AWS_BUCKET_NAME),
        Key: `${filefolder}/${file}`,
      })
      .promise();
  }
}
