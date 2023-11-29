import httpStatus from 'http-status';
import supertest from 'supertest';
import app from '@/app';
import prisma from '@/database/database-connection'; // eslint-disable-line @typescript-eslint/no-unused-vars

const api = supertest(app);

/* Clean the database before each test

beforeEach(async () => {
    await prisma.game.deleteMany();
  });
  
*/

describe('Get /health', () => {
  it('should return status 200 and an ok message', async () => {
    const { status, text } = await api.get('/health');
    expect(status).toBe(httpStatus.OK);
    expect(text).toBe("I'm ok!");
  });
});
