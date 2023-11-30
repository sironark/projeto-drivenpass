import prisma from '@/database/database-connection';

async function getCredentialsByUser(userId: number) {
  const credentials = await prisma.credential.findMany({
    where: {
      userId,
    },
  });
  return credentials;
}

async function getCredentialsById(userId: number, id: number) {
  const credential = await prisma.credential.findMany({
    where: {
      id,
      userId,
    },
  });
  return credential;
}

async function getCredentialsByUserTitle(userId: number, title: string) {
  const credentials = await prisma.credential.findFirst({
    where: {
      userId,
      title,
    },
  });
  return credentials;
}

async function getNetworksByUser(userId: number) {
  const networks = await prisma.network.findMany({
    where: {
      userId,
    },
  });
  return networks;
}

async function getCredentialByUrl(url: string, userId: number) {
  const credential = await prisma.credential.findMany({
    where: {
      url,
      userId,
    },
  });
  return credential;
}

async function createCredential(userId: number, url: string, username: string, password: string, title: string) {
  const game = await prisma.credential.create({
    data: {
      title,
      url,
      username,
      password,
      userId,
    },
  });
  return game;
}

async function deleteCredential(userId: number, id: number) {
  const credential = await prisma.credential.delete({
    where: {
      userId,
      id,
    },
  });
  return credential;
}

export const recordRepository = {
  getCredentialsByUser,
  getNetworksByUser,
  getCredentialByUrl,
  getCredentialsByUserTitle,
  createCredential,
  getCredentialsById,
  deleteCredential,
};
