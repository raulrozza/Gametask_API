// eslint-disable-next-line no-unused-vars
declare namespace Express {
  export interface Request {
    game: string;
    auth: {
      id: string;
    };
  }
}
