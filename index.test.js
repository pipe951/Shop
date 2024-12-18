// จัดเตรียม environment สำหรับการทดสอบ
const fs = require('fs');
const path = require('path');

describe('App functionality', () => {
  let document;

  beforeAll(() => {
    // โหลดไฟล์ index.html
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    document = new JSDOM(html).window.document;
  });

  test('should display message when button is clicked', () => {
    // หาปุ่มและข้อความ
    const button = document.getElementById('greetButton');
    const messageDiv = document.getElementById('message');

    // ทำการคลิกปุ่ม
    button.click();

    // ทดสอบว่าข้อความที่แสดงใน div ถูกต้อง
    expect(messageDiv.innerText).toBe('Hello, World!');
  });
});
