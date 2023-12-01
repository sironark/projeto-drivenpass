import { Session } from '@prisma/client';
import { createUser } from './users-factory';
import prisma from '@/database/database-connection';

export async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return await prisma.session.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}
