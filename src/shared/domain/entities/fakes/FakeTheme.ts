import { ITheme } from '@shared/domain/entities';
import faker from 'faker';

export default class FakeTheme implements ITheme {
  public primary: string = faker.random.hexaDecimal(6);
  public secondary: string = faker.random.hexaDecimal(6);
}
