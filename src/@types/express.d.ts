import 'express';
import { Types } from 'mongoose';

declare module 'express' {
  export interface IAuth {
    id: Types.ObjectId;
  }

  export interface Request {
    game: Types.ObjectId;
    auth: IAuth;
  }
}
