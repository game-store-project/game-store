export type IGenre = {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    Game: number;
  };
};
