import { IResponseError } from '@shared/infra/http/entities';

export default interface IAppError {
  message: string;
  errorCode: number;
  statusCode?: number;

  toJsonResponse(): IResponseError;
}
