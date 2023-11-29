import { Game } from '@prisma/client';
import Joi from 'joi';

export const gameInputSchema = Joi.object<Game>({
  name: Joi.string().required(),
});
