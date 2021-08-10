import { IAppError, IErrorResponse } from '@shared/domain/errors';

export default class RequestError extends Error implements IAppError {
  constructor(
    public readonly message: string,
    public readonly errorCode: number,
    public readonly statusCode = 400,
  ) {
    super(message);
  }

  public toJsonResponse(): IErrorResponse {
    const jsonResponse: IErrorResponse = {
      errorCode: this.errorCode,
      message: this.message,
    };

    return jsonResponse;
  }
}
