import faker from 'faker';
import { ITheme } from '@modules/games/domain/entities';

export default class FakeTheme implements ITheme {
  public primary: string = faker.random.hexaDecimal(6);
  public secondary: string = faker.random.hexaDecimal(6);
}
