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
  const existsSomeCredential = await recordRepository.getCredentialsByUser(userId);
  if (!existsSomeCredential) throw notFoundError('Any credential was found to this user');

  const credential = await recordRepository.getCredentialsById(userId, id);
  if (credential.length == 0) throw invalidDataError('Credential Id does not belong to the user');

  return credential;
}

async function createCredential(userId: number, url: string, username: string, password: string, title: string) {
  const existTwoTimes = await recordRepository.getCredentialByUrl(url, userId);
  if (existTwoTimes.length == 2) throw conflictError('Url already exists two times!');

  const titleExists = await recordRepository.getCredentialsByUserTitle(userId, title);
  if (titleExists) throw conflictError('Title already exists times!');

  const credential = await recordRepository.createCredential(userId, url, username, password, title);
  return credential;
}

async function deleteCredential(userId: number, id: number) {
  const idExists = await recordRepository.getCredentialsById(userId, id);
  if (idExists.length == 0) throw notFoundError('Credential not found or is not belong to the user!');

  const credential = await recordRepository.deleteCredential(userId, id);
  return credential;
}

export const recordService = {
  getRecords,
  createCredential,
  getRecordsById,
  deleteCredential,
};
