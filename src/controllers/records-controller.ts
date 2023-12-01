import { Response } from 'express';
import httpStatus from 'http-status';
import Cryptr from 'cryptr';
import { recordService } from '@/services/records-service';
import { invalidParamError } from '@/errors/invalid-param-error';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';

export async function getRecords(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const records = await recordService.getRecords(userId);
  const cryptr = new Cryptr('myTotallySecretKey');

  const decryptedData = records.credentials.map((credential) => ({
    ...credential,
    password: cryptr.decrypt(credential.password),
  }));

  const response = { credentials: decryptedData };
  res.status(httpStatus.OK).send(response);
}

export async function getRecordsById(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const id = Number(req.params.id);
  if (!id || isNaN(id) || id < 1) throw invalidParamError('Id param not valid!');

  const records = await recordService.getRecordsById(userId, id);
  const cryptr = new Cryptr('myTotallySecretKey');

  const decryptedData = records.map((credential) => ({
    ...credential,
    password: cryptr.decrypt(credential.password),
  }));

  const response = { credential: decryptedData };
  res.status(httpStatus.OK).send(response);
}

export async function createCredential(req: AuthenticatedRequest, res: Response) {
  const { url, username, password, title } = req.body;
  const { userId } = req;
  const cryptr = new Cryptr('myTotallySecretKey');
  const passwordhash = cryptr.encrypt(password);

  await recordService.createCredential(userId, url, username, passwordhash, title);

  res.status(httpStatus.CREATED).send('Creaded!');
}

export async function deleteCredential(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id < 1) throw invalidParamError('Id param not valid!');

  const userId = req.userId;
  await recordService.deleteCredential(userId, id);

  res.sendStatus(httpStatus.OK);
}

export async function createNetwork(req: AuthenticatedRequest, res: Response) {
  const { network, password, title } = req.body;
  const { userId } = req;

  const cryptr = new Cryptr('myTotallySecretKey');
  const passwordhash = cryptr.encrypt(password);

  await recordService.createNetwork(userId, network, passwordhash, title);

  res.sendStatus(httpStatus.CREATED);
}

export async function getNetworks(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const records = await recordService.getNetworks(userId);
  const cryptr = new Cryptr('myTotallySecretKey');

  const decryptedData = records.networks.map((network) => ({
    ...network,
    password: cryptr.decrypt(network.password),
  }));

  const response = { networks: decryptedData };
  res.status(httpStatus.OK).send(response);
}

export async function getNetworkById(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const id = Number(req.params.id);
  if (!id || isNaN(id) || id < 1) throw invalidParamError('Id param not valid!');

  const records = await recordService.getNetworkById(userId, id);
  const cryptr = new Cryptr('myTotallySecretKey');

  const decryptedData = records.map((network) => ({
    ...network,
    password: cryptr.decrypt(network.password),
  }));

  const response = { network: decryptedData };
  res.status(httpStatus.OK).send(response);
}

export async function deleteNetwork(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id < 1) throw invalidParamError('Id param not valid!');

  const userId = req.userId;
  await recordService.deleteNetwork(userId, id);

  res.sendStatus(httpStatus.OK);
}
