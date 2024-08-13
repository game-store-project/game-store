import { IGenre } from './genre';

export type IGame = {
  id: string;
  title: string;
  slug: string;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
  disponibility: boolean;
  createdAt: Date;
  genre: IGenre;
};
