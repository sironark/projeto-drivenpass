import { Router } from 'express';
import { createGame, deleteGame, editGame, getGameById, getGames } from '@/controllers/template-controller';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation-middleware';
import { gameInputSchema } from '@/schemas/template-schema';

const gamesRouter = Router();

gamesRouter.get('/', getGames);
gamesRouter.get('/:id', getGameById);
gamesRouter.post('/', createGame);
gamesRouter.put('/:id', validateSchemaMiddleware(gameInputSchema), editGame);
gamesRouter.delete('/:id', validateSchemaMiddleware(gameInputSchema), deleteGame);

export default gamesRouter;
