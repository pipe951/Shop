// Import ไฟล์ script.js ถ้าจำเป็น
const fs = require('./script.js');
const path = require('./script.js');

beforeEach(() => {
  const cartItems = document.createElement('div');
  cartItems.id = 'cart-items';
  document.body.appendChild(cartItems);
});

afterEach(() => {
  const cartItems = document.getElementById('cart-items');
  if (cartItems) {
    cartItems.remove();
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

