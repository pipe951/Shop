// Import ไฟล์ script.js ถ้าจำเป็น
const fs = require('fs');
const path = require('path');

beforeEach(() => {
  // สร้างปุ่ม checkoutButton และเพิ่มใน DOM
  const checkoutButton = document.createElement('button');
  checkoutButton.id = 'checkoutButton';
  document.body.appendChild(checkoutButton);
});

afterEach(() => {
  // ลบ checkoutButton ออกจาก DOM หลังการทดสอบ
  const checkoutButton = document.getElementById('checkoutButton');
  if (checkoutButton) {
    checkoutButton.remove();
  }
});

test('should add event listener to checkoutButton', () => {
  const checkoutButton = document.getElementById('checkoutButton');
  expect(checkoutButton).not.toBeNull();

  // สร้าง Jest Spy เพื่อตรวจสอบ addEventListener
  const addEventListenerSpy = jest.spyOn(checkoutButton, 'addEventListener');

  // เรียกโค้ดที่จะเพิ่ม event listener (ฟังก์ชันจริงของคุณ)
  require('./script'); // นำเข้าไฟล์ script.js

  // ตรวจสอบว่า addEventListener ถูกเรียกด้วย "click" และ callback function
  expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
});

