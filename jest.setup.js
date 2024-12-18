require('jest-localstorage-mock');

beforeEach(() => {
  // เพิ่มองค์ประกอบที่จำเป็นใน DOM
  const checkoutButton = document.createElement('button');
  checkoutButton.id = 'checkoutButton';
  document.body.appendChild(checkoutButton);
});

test('should add event listener to checkoutButton', () => {
  // ทดสอบฟังก์ชันที่ใช้ document.getElementById
  const checkoutButton = document.getElementById('checkoutButton');
  expect(checkoutButton).not.toBeNull();
  // ทดสอบว่า addEventListener ถูกเรียกหรือไม่
  const addEventListenerSpy = jest.spyOn(checkoutButton, 'addEventListener');
  checkoutButton.click();
  expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
});
