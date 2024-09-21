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
  genreId: string;
  genre?: {
    id: string;
    name: string;
    createdAt: Date;
  };
};
