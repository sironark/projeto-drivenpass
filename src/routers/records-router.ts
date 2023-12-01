import { Router } from 'express';
import {
  createCredential,
  createNetwork,
  deleteCredential,
  deleteNetwork,
  getNetworkById,
  getNetworks,
  getRecords,
  getRecordsById,
} from '@/controllers/records-controller';
import { authenticateToken } from '@/middlewares/authentication-middleware';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation-middleware';
import { CredentialSchema } from '@/schemas/credential-schema';
import { NetworkSchema } from '@/schemas/network-schema';

const recordsRouter = Router();

recordsRouter.get('/credential', authenticateToken, getRecords);
recordsRouter.get('/credential/:id', authenticateToken, getRecordsById);
recordsRouter.post('/credential', authenticateToken, validateSchemaMiddleware(CredentialSchema), createCredential);
recordsRouter.delete('/credential/:id', authenticateToken, deleteCredential);

recordsRouter.post('/network', authenticateToken, validateSchemaMiddleware(NetworkSchema), createNetwork);
recordsRouter.get('/network', authenticateToken, getNetworks);
recordsRouter.get('/network/:id', authenticateToken, getNetworkById);
recordsRouter.delete('/network/:id', authenticateToken, deleteNetwork);

export { recordsRouter };
