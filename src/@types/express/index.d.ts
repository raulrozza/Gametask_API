import 'express';
import 'express-serve-static-core';
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

declare module 'express-serve-static-core' {
  export interface IAuth {
    id: Types.ObjectId;
  }

  export interface Request {
    game: Types.ObjectId;
    auth: IAuth;
  }
}
