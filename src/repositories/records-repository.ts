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

async function getCredentialById(id: number) {
  const credential = await prisma.credential.findFirst({
    where: {
      id,
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
  const credential = await prisma.credential.create({
    data: {
      title,
      url,
      username,
      password,
      userId,
    },
  });
  return credential;
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

async function createNetwork(userId: number, network: string, password: string, title: string) {
  const createdNetwork = await prisma.network.create({
    data: {
      title,
      network,
      password,
      userId,
    },
  });
  return createdNetwork;
}

async function getNetworkByName(network: string, userId: number) {
  const gotNetwork = await prisma.network.findFirst({
    where: {
      network,
      userId,
    },
  });
  return gotNetwork;
}

async function getNetworks(userId: number) {
  const gotNetwork = await prisma.network.findMany({
    where: {
      userId,
    },
  });
  return gotNetwork;
}

async function getNetworkById(netId: number) {
  const gotNetwork = await prisma.network.findFirst({
    where: {
      id: netId,
    },
  });
  return gotNetwork;
}

async function deleteNetwork(userId: number, id: number) {
  const deleted = await prisma.network.delete({
    where: {
      userId,
      id,
    },
  });
  return deleted;
}

export const recordRepository = {
  getCredentialsByUser,
  getNetworksByUser,
  getCredentialByUrl,
  getCredentialsByUserTitle,
  createCredential,
  getCredentialsById,
  deleteCredential,
  createNetwork,
  getNetworkByName,
  getNetworks,
  getNetworkById,
  deleteNetwork,
  getCredentialById,
};
