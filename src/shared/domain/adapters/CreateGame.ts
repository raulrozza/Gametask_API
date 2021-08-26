import ICreateGameDTO from '@modules/games/domain/dtos/ICreateGameDTO';

export default class CreateGameAdapter {
  public name: string;
  public description: string;
  public administrators: string[];

  constructor({ name, description, creatorId }: ICreateGameDTO) {
    this.name = name;
    this.description = description;
    this.administrators = [creatorId];
  }
}
