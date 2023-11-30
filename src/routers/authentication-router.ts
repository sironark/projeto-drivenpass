import { Router } from 'express';

import { validateSchemaMiddleware } from '@/middlewares/schema-validation-middleware';
import { signInSchema } from '@/schemas/authenticate-schema';
import { singInPost } from '@/controllers/authentication-controller';

const authenticationRouter = Router();

authenticationRouter.post('/', validateSchemaMiddleware(signInSchema), singInPost);

export { authenticationRouter };
