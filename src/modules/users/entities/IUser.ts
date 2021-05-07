export default interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  image?: string;
  profile_url?: string;
}
