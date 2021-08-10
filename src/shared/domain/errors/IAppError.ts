export interface IErrorResponse {
  message: string;
  errorCode: number;
}

export default interface IAppError {
  message: string;
  errorCode: number;
  statusCode?: number;

  toJsonResponse(): IErrorResponse;
}
