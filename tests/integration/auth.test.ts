import httpStatus from 'http-status';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import app from '@/app';
import prisma from '@/database/database-connection'; // eslint-disable-line @typescript-eslint/no-unused-vars

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

// Por algum motivo não consegui colocar uma função cleanDB() no beforeEach, estava dando erro de achar a função no helper.ts
beforeEach(async () => {
  await prisma.network.deleteMany({});
  await prisma.credential.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
});

const api = supertest(app);

describe('Post /signup and signin', () => {
  it('should return status 400 when no body', async () => {
    const answare1 = await api.post('/signup');
    const answare2 = await api.post('/signin');

    expect(answare1.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(answare2.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should return status 400 when body is not valid', async () => {
    const body = { email: 'exemplo', password: '123' };

    const answare1 = await api.post('/signup').send(body);
    const answare2 = await api.post('/signin').send(body);

    expect(answare1.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(answare2.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('When body is valid', () => {
    const genValidyBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password({ length: 20 }),
    });
    it('should return status 201 when body is valid at signup and 200 at signin', async () => {
      const body = genValidyBody();

      const answare1 = await api.post('/signup').send(body);
      const answare2 = await api.post('/signin').send(body);

      expect(answare1.status).toBe(httpStatus.CREATED);
      expect(answare2.status).toBe(httpStatus.OK);
    });

    it('should return status 401 when password is incorrect ', async () => {
      const body = genValidyBody();
      await createUser(body);

      const badBody = {
        email: body.email,
        password: faker.internet.password({ length: 20 }),
      };

      const answare = await api.post('/signin').send(badBody);

      expect(answare.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return status 401 when email is incorrect ', async () => {
      const body = genValidyBody();
      await createUser(body);

      const badBody = {
        email: faker.internet.email(),
        password: body.password,
      };

      const answare = await api.post('/signin').send(badBody);

      expect(answare.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const body = genValidyBody();
        await createUser(body);

        const response = await api.post('/signin').send(body);
        expect(response.status).toBe(httpStatus.OK);
      });

      it('should respond with user data', async () => {
        const body = genValidyBody();
        const user = await createUser(body);

        const response = await api.post('/signin').send(body);

        expect(response.body.user).toEqual({
          id: user.id,
          email: user.email,
        });
      });
    });
  });
});
