import 'express';

declare module 'express' {
  export interface IAuth {
    id: string;
  }

  export interface Request {
    game: string;
    auth: IAuth;
  }
}
