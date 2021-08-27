interface IConstructor {
  id: string;
  name: string;
}

export default class UpdateTitleAdapter {
  public id: string;
  public name: string;

  constructor({ id, name }: IConstructor) {
    this.id = id;
    this.name = name;
  }
}
