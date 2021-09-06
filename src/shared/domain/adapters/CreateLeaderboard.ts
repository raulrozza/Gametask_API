interface IConstructor {
  game: string;
}

export default class CreateLeaderboardAdapter {
  public game: string;
  public createdAt: Date;
  public expiresAt: Date | undefined;

  constructor({ game }: IConstructor) {
    this.game = game;
    this.createdAt = new Date();
    this.expiresAt = undefined;
  }
}
