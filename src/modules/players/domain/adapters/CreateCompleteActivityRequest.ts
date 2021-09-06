interface IConstructor {
  requester: string;
  activity: string;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: string;
}

export default class CreateCompleteActivityRequestAdapter {
  public requester: string;
  public activity: string;
  public requestDate: Date;
  public completionDate: Date;
  public information: string;
  public game: string;

  constructor({
    requester,
    activity,
    requestDate,
    completionDate,
    information,
    game,
  }: IConstructor) {
    this.requester = requester;
    this.activity = activity;
    this.requestDate = requestDate;
    this.completionDate = completionDate;
    this.information = information;
    this.game = game;
  }
}
