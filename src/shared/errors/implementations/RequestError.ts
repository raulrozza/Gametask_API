import { IResponseError } from '@shared/infra/http/entities';
import { IAppError } from '@shared/errors/entities';

export default class RequestError extends Error implements IAppError {
  constructor(
    public readonly message: string,
    public readonly errorCode: number,
    public readonly statusCode = 400,
  ) {
    super(message);
  }

  public toJsonResponse(): IResponseError {
    const jsonResponse: IResponseError = {
      errorCode: this.errorCode,
      message: this.message,
    };

    return jsonResponse;
  }
}