const request = require('supertest');
const app = require('./index');  // หากคุณมีไฟล์ server ที่เริ่มต้นแอปพลิเคชัน

describe('GET /', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
