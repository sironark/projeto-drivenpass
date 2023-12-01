import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createUser } from './factory/users-factory';
import { createSession } from './factory/sessions-factory';
import prisma from '@/database/database-connection';

async function cleanDb() {
  await prisma.network.deleteMany({});
  await prisma.credential.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
}

async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export const helper = {
  cleanDb,
  generateValidToken,
};
