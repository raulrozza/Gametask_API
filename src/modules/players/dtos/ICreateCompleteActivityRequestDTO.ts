export default interface ICreateCompleteActivityRequestDTO {
  gameId: string;
  requester: string;
  activity: string;
  requestDate: Date;
  completionDate: Date;
  information: string;
}
