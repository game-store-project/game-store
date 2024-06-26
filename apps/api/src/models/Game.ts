import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Game = prisma.game;
