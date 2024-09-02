import { Game } from '../models/Game';
import { UserGames } from '../models/UserGames';

export const getHighlights = async () => {
  const newReleases = await getNewReleases(4);
  const recommended = await getRecomendedGames(4);
  const bestSellers = await getBestSellers(4);

  const uniqueOcurrences = new Map();

  newReleases.map((game) => {
    if (!uniqueOcurrences.has(game.id)) {
      uniqueOcurrences.set(game.id, game);
    }
  });

  recommended.map((game) => {
    if (!uniqueOcurrences.has(game.id)) {
      uniqueOcurrences.set(game.id, game);
    }
  });

  bestSellers.map((game) => {
    if (!uniqueOcurrences.has(game.id)) {
      uniqueOcurrences.set(game.id, game);
    }
  });

  const highlights = Array.from(uniqueOcurrences.values())
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return highlights;
};

export const getNewReleases = async (max: number | undefined) => {
  const newReleases = await Game.findMany({
    orderBy: [{ createdAt: 'desc' }],
    where: {
      disponibility: true,
    },
    take: max,
  });

  return newReleases;
};

export const getRecomendedGames = async (max: number | undefined) => {
  const rug = await UserGames.findMany({
    include: { game: true },
    orderBy: { purchaseDate: 'desc' },
    where: {
      game: {
        disponibility: true,
      },
    },
    take: max ? max * 2 : undefined,
  });

  const latestOcurrences = new Map();

  rug.map((ug) => {
    if (!latestOcurrences.has(ug.gameId)) {
      latestOcurrences.set(ug.gameId, ug);
    }
  });

  const recommended = Array.from(latestOcurrences.values());

  if (max) {
    return recommended.map((ug) => ug.game).slice(0, max);
  }

  return recommended.map((ug) => ug.game);
};

export const getBestSellers = async (max: number | undefined) => {
  const bestSellers = await Game.findMany({
    include: {
      _count: {
        select: { users: true },
      },
      users: true,
    },
    orderBy: {
      users: {
        _count: 'desc',
      },
    },
    where: {
      disponibility: true,
    },
    take: max,
  });

  return bestSellers;
};
