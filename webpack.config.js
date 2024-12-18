const path = require('path');

module.exports = {
  entry: './src/index.js',  // ไฟล์เริ่มต้นของแอปพลิเคชัน
  output: {
    filename: 'bundle.js',  // ผลลัพธ์ที่ได้จากการ bundle
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development'  // โหมดที่ใช้ในการ build (สามารถเปลี่ยนเป็น 'production' ได้)
};
