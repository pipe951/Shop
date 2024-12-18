// Import ไฟล์ script.js ถ้าจำเป็น
const fs = require('fs');
const path = require('path');

// โหลด HTML จำลองที่ต้องการทดสอบ
beforeEach(() => {
    // โหลด HTML ไฟล์จำลอง
    document.body.innerHTML = fs.readFileSync(
        path.resolve(__dirname, './index.html'), 
        'utf8'
    );

    // เพิ่ม checkoutButton เข้าไปใน DOM
    const checkoutButton = document.createElement('button');
    checkoutButton.id = 'checkoutButton';
    document.body.appendChild(checkoutButton);
});

test('should add event listener to checkoutButton', () => {
    // ทดสอบฟังก์ชันที่ใช้ document.getElementById
    const checkoutButton = document.getElementById('checkoutButton');
    expect(checkoutButton).not.toBeNull();

    // Mock addEventListener และตรวจสอบว่ามันถูกเรียก
    const addEventListenerSpy = jest.spyOn(checkoutButton, 'addEventListener');
    checkoutButton.click();
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
});
