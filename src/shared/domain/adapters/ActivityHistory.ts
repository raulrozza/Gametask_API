interface IConstructor {
  user: string;
  log: Date;
}

export default class ActivityHistoryAdapter {
  public user: string;
  public log: Date;

  constructor({ user, log }: IConstructor) {
    this.user = user;
    this.log = log;
  }
}
