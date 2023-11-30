import { Router } from 'express';
import { createUserSchema } from '@/schemas/users-schemas';
import { usersPost } from '@/controllers/users-controller';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation-middleware';

const usersRouter = Router();

usersRouter.post('/', validateSchemaMiddleware(createUserSchema), usersPost);

export { usersRouter };
