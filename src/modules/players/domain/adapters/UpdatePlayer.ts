import { IRank } from '@shared/domain/entities';

interface IConstructor {
  id: string;
  experience: number;
  level: number;
  rank?: IRank;
  currentTitle?: string;
}

export default class UpdatePlayerAdapter {
  public id: string;
  public experience: number;
  public level: number;
  public rank?: IRank;
  public currentTitle?: string;

  constructor({ id, experience, level, rank, currentTitle }: IConstructor) {
    this.id = id;
    this.experience = experience;
    this.level = level;
    this.rank = rank;
    this.currentTitle = currentTitle;
  }
}
