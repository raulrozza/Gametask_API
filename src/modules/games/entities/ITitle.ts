import { IGame } from '.';

export default interface ITitle {
  id: string;
  name: string;
  game: string | IGame;
}
