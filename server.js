const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QLRDULXE6bgMjnAEB0nZntffpkZBjgvWDzeKPhrXRjmka6TcWMjCQJcCqbsTHUKe0UZSuIYbu59oLIHYRTFdbQX00sWXRodRZ');  // ใส่ Stripe Secret Key ของคุณ

const app = express();

app.use(cors());
app.use(express.static('public')); // ให้บริการไฟล์ static เช่น HTML, CSS, JS
app.use(express.json());  // สำหรับรับข้อมูลในรูปแบบ JSON

// สร้าง Checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        // สร้าง Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.cart.map(item => ({
                price_data: {
                    currency: 'thb',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,  // แปลงเป็นหน่วยสตางค์
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'http://127.0.0.1:5500/success.html',
            cancel_url: 'http://127.0.0.1:5500/cancel.html',
        });

        res.json({ id: session.id });

        // เรียก Stripe Payment Page API
        const fetch = (await import('node-fetch')).default;  // dynamic import ของ node-fetch

        const secretKey = 'sk_test_51QLRDULXE6bgMjnAEB0nZntffpkZBjgvWDzeKPhrXRjmka6TcWMjCQJcCqbsTHUKe0UZSuIYbu59oLIHYRTFdbQX00sWXRodRZ';  // Secret API Key ของ Stripe ที่ถูกต้อง

        const data = { 
            /* ข้อมูลที่ต้องการส่งไปกับคำขอ 
            อาจจะเป็นข้อมูลเกี่ยวกับการสร้าง payment page หรืออื่นๆ ที่ Stripe ต้องการ
            ตัวอย่างเช่นการสร้าง `payment_page` ขึ้นมาใหม่ เป็นต้น
            */
        };

        // ส่งคำขอไปที่ Stripe Payment Page API
        fetch('https://api.stripe.com/v1/payment_pages/cs_test_a1DdJbrdPvDGSRO1AaN8oPPivdyhMaiLRORh6Vztx3xmU53dSwmbQOtydI/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secretKey}`  // ใช้ API Secret Key ที่ถูกต้อง
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาด');
    }
});

const port = 3000;  // ใช้พอร์ต 3000 สำหรับ Express.js API
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});

test('server should run on port 3000', () => {
  const port = 3000;
  expect(port).toBe(3000);  // ตัวอย่างการทดสอบ
});

test('server should start', async () => {
  const server = startServer(); // สมมติว่ามีฟังก์ชัน startServer()
  await server.listen(3000);
  expect(server).toBeTruthy(); // ตรวจสอบว่าเซิร์ฟเวอร์เริ่มทำงาน
});

