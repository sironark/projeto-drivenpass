import { conflictError } from '@/errors/conflict-error';
import { notFoundError } from '@/errors/not-found-error';
import { gameRepository } from '@/repositories/template-repository';

async function getGames() {
  const games = await gameRepository.getGames();
  return games;
}

async function getGameById(gameId: number) {
  const game = await gameRepository.getGameById(gameId);

  if (!game) throw notFoundError('Game not found!');
  return game;
}

async function createGame(gameName: string) {
  const alreadyExist = await gameRepository.getGameByName(gameName);
  if (alreadyExist) throw conflictError('Game already exists!');

  const game = await gameRepository.createGame(gameName);
  return game;
}

async function editGame(gameId: number, gameName: string) {
  const idExists = await gameRepository.getGameById(gameId);
  if (!idExists) throw notFoundError('Game not found!');

  const nameRepeated = await gameRepository.getGameByName(gameName);
  if (nameRepeated) throw conflictError('Name game already exists!');

  const game = await gameRepository.editGame(gameId, gameName);
  return game;
}

async function deleteGame(gameId: number) {
  const idExists = await gameRepository.getGameById(gameId);
  if (!idExists) throw notFoundError('Game not found!');

  const game = await gameRepository.deleteGame(gameId);
  return game;
}

export const gameService = {
  getGames,
  getGameById,
  createGame,
  editGame,
  deleteGame,
};
