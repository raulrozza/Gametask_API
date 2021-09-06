import ICreateActivityDTO from '@modules/games/domain/dtos/ICreateActivityDTO';

export default class CreateActivityAdapter {
  public name: string;
  public description?: string;
  public experience: number;
  public dmRules?: string;
  public game: string;
  public changelog = [];
  public history = [];

  constructor({
    gameId,
    name,
    description,
    experience,
    dmRules,
  }: ICreateActivityDTO) {
    this.name = name;
    this.description = description;
    this.experience = experience;
    this.dmRules = dmRules;
    this.game = gameId;
  }
}
