import httpStatus from 'http-status';
import supertest from 'supertest';
import app from '@/app';

const api = supertest(app);

describe('Get /health', () => {
  it('should return status 200 and an ok message', async () => {
    const { status, text } = await api.get('/health');
    expect(status).toBe(httpStatus.OK);
    expect(text).toBe("I'm ok!");
  });
});
