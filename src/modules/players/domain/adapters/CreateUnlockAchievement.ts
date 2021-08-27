interface IConstructor {
  requester: string;
  achievement: string;
  requestDate: Date;
  information?: string;
  game: string;
}

export default class CreateUnlockAchievementAdapter {
  public requester: string;
  public achievement: string;
  public requestDate: Date;
  public information?: string;
  public game: string;

  constructor({
    requester,
    achievement,
    requestDate,
    information,
    game,
  }: IConstructor) {
    this.requester = requester;
    this.achievement = achievement;
    this.requestDate = requestDate;
    this.information = information;
    this.game = game;
  }
}
