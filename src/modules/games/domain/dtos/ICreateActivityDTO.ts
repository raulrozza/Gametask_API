export default interface ICreateActivityDTO {
  gameId: string;
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
}
