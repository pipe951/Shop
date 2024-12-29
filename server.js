require('dotenv').config();  // โหลด Environment Variables จากไฟล์ .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // ใส่ Stripe Secret Key ของคุณ

const app = express();

app.use(cors());
app.use(express.static('public')); // ให้บริการไฟล์ static เช่น HTML, CSS, JS
app.use(express.json());  // สำหรับรับข้อมูลในรูปแบบ JSON

// สร้าง Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    const { cart } = req.body;
    if (!cart || cart.length === 0) {
        return res.status(400).send({ error: 'Cart is empty' });
    }
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cart.map(item => ({
                price_data: {
                    currency: 'thb',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // ราคาเป็นเซ็นต์
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'http://127.0.0.1:5500/success.html',  // URL ของหน้าขอบคุณหลังชำระเงิน
            cancel_url: 'http://127.0.0.1:5500/cancel.html',  // URL ถ้าผู้ใช้ยกเลิก
        });
        
        res.json({ id: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating checkout session');
    }
});


// ตรวจสอบสถานะการชำระเงิน
app.post('/check-payment-status', async (req, res) => {
    const { sessionId } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // ถ้าการชำระเงินสำเร็จ ส่งผลลัพธ์กลับ
            res.json({ success: true });
        } else {
            // ถ้าการชำระเงินไม่สำเร็จ
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error checking payment status');
    }
});



const PORT = process.env.PORT || 3001; // เปลี่ยนจาก 3000 เป็น 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

