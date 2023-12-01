import { conflictError } from '@/errors/conflict-error';
import { invalidDataError } from '@/errors/invalid-data-error';
import { notFoundError } from '@/errors/not-found-error';
import { recordRepository } from '@/repositories/records-repository';

async function getRecords(userId: number) {
  const credentials = await recordRepository.getCredentialsByUser(userId);
  //const networks = await recordRepository.getNetworksByUser(userId);

  return { credentials };
}

async function getRecordsById(userId: number, id: number) {
  const credential = await recordRepository.getCredentialById(id);
  if (!credential) throw notFoundError('Network was not found');
  if (credential.userId != userId) throw invalidDataError('This network is not yours!');

  return [credential];
}

async function createCredential(userId: number, url: string, username: string, password: string, title: string) {
  const existTwoTimes = await recordRepository.getCredentialByUrl(url, userId);
  if (existTwoTimes.length == 2) throw conflictError('Url already exists two times!');

  const titleExists = await recordRepository.getCredentialsByUserTitle(userId, title);
  if (titleExists) throw conflictError('Title already exists!');

  const credential = await recordRepository.createCredential(userId, url, username, password, title);
  return credential;
}

async function deleteCredential(userId: number, id: number) {
  const idExists = await recordRepository.getCredentialsById(userId, id);
  if (idExists.length == 0) throw notFoundError('Credential not found or is not belong to the user!');

  const credential = await recordRepository.deleteCredential(userId, id);
  return credential;
}

async function createNetwork(userId: number, network: string, password: string, title: string) {
  const alreadyExists = await recordRepository.getNetworkByName(network, userId);
  if (alreadyExists) throw conflictError('Network already exists at your records!');

  const createdNetwork = await recordRepository.createNetwork(userId, network, password, title);
  return createdNetwork;
}

async function getNetworks(userId: number) {
  const networks = await recordRepository.getNetworks(userId);

  return { networks };
}

async function getNetworkById(userId: number, id: number) {
  const userNetwork = await recordRepository.getNetworkById(id);
  if (!userNetwork) throw notFoundError('Network was not found');
  if (userNetwork.userId != userId) throw invalidDataError('This network is not yours!');

  return [userNetwork];
}

async function deleteNetwork(userId: number, id: number) {
  const userNetwork = await recordRepository.getNetworkById(id);
  if (!userNetwork) throw notFoundError('Network was not found');
  if (userNetwork.userId != userId) throw invalidDataError('This network is not yours!');

  const deleted = await recordRepository.deleteNetwork(userId, id);
  return deleted;
}

export const recordService = {
  getRecords,
  createCredential,
  getRecordsById,
  deleteCredential,
  createNetwork,
  getNetworks,
  getNetworkById,
  deleteNetwork,
};
