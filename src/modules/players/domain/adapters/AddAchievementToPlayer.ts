interface IConstructor {
  id: string;
  achievement: string;
  title?: string;
}

export default class AddAchievementToPlayerAdapter {
  public id: string;
  public achievement: string;
  public title?: string;

  constructor({ id, achievement, title }: IConstructor) {
    this.id = id;
    this.achievement = achievement;
    this.title = title;
  }
}
