import httpStatus from 'http-status';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Session, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import app from '@/app';
import prisma from '@/database/database-connection'; // eslint-disable-line @typescript-eslint/no-unused-vars

// Por algum motivo não consegui colocar uma função cleanDB() no beforeEach, estava dando erro de achar a função no helper.ts
beforeEach(async () => {
  await prisma.network.deleteMany({});
  await prisma.credential.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
});

// Por algum motivo não consegui colocar uma função cleanDB() no beforeEach, estava dando erro de achar a função no helper.ts
beforeAll(async () => {
  await prisma.network.deleteMany({});
  await prisma.credential.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
});

async function createUser(params: Partial<User> = {}): Promise<User> {
  const incomingPassword = params.password || faker.internet.password({ length: 10 });
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return await prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}

async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return await prisma.session.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}

async function createCredential(userId: number, url?: string) {
  const credential = await prisma.credential.create({
    data: {
      title: faker.lorem.word(),
      url: url || faker.internet.url(),
      username: faker.person.firstName(),
      password: faker.internet.password({ length: 10 }),
      userId,
    },
  });
  return credential;
}

const api = supertest(app);

describe('Get /credential', () => {
  it('should return status 401 when try get all credentials with rong token', async () => {
    const answare = await api.get('/pass/credential').set('Authorization', `Bearer 123456789`);

    expect(answare.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 when try get all credentials without token', async () => {
    const answare = await api.get('/pass/credential');

    expect(answare.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 when there is no session for token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const answare = await api.get('/pass/credential').set('Authorization', `Bearer ${token}`);
    expect(answare.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is ok', () => {
    it('should return status 200 when get all credentials', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
      await createSession(token);

      const answare = await api.get('/pass/credential').set('Authorization', `Bearer ${token}`);
      expect(answare.status).toBe(httpStatus.OK);
    });

    it('should return status 422 when get one credential with rong id', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
      await createSession(token);

      const answare = await api.get('/pass/credential/:-1').set('Authorization', `Bearer ${token}`);
      expect(answare.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return status 422 when get one credential of other user', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
      await createSession(token);

      const answare = await api.get('/pass/credential/:50').set('Authorization', `Bearer ${token}`);
      expect(answare.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return status 400 when get one credential is not yours', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
      const session = await createSession(token);
      const credential = await createCredential(session.userId);
      const answare = await api.get(`/pass/credential/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(answare.status).toBe(httpStatus.BAD_REQUEST);
      expect(answare.body).toEqual({ message: 'Invalid data: This network is not yours!' });
    });
  });
});

describe('POST credentials', () => {
  it('should return status 422 when post one rong credential ', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
    await createSession(token);

    const body = {
      title: faker.lorem.word(),
      url: faker.internet.url(),
      username: faker.person.firstName(),
    };

    const answare = await api.post('/pass/credential').set('Authorization', `Bearer ${token}`).send(body);

    expect(answare.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});

describe('Delete credentials', () => {
  it('should return status 422 when post one rong param to delete ', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMTQ1MjM3N30.O4hu35cRznwhFeyomk3sJR49BSI0r0kS8J2YbjnF_mA';
    await createSession(token);

    const answare = await api.delete('/pass/credential/:-1').set('Authorization', `Bearer ${token}`);

    expect(answare.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});
