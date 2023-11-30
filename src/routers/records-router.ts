import { Router } from 'express';
import { createCredential, deleteCredential, getRecords, getRecordsById } from '@/controllers/records-controller';
import { authenticateToken } from '@/middlewares/authentication-middleware';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation-middleware';
import { CredentialSchema } from '@/schemas/credential-schema';

const recordsRouter = Router();

recordsRouter.get('/records', authenticateToken, getRecords);
recordsRouter.get('/records/:id', authenticateToken, getRecordsById);
recordsRouter.post('/records', authenticateToken, validateSchemaMiddleware(CredentialSchema), createCredential);
recordsRouter.delete('records/:id', authenticateToken, deleteCredential);

export default recordsRouter;
