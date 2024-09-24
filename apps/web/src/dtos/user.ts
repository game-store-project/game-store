import { IGame } from './game';

export type IUser = {
  id: string;
  avatar: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  games: IGame[];
};
