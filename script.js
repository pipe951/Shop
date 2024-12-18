// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

beforeEach(() => {
  // เพิ่มองค์ประกอบที่จำเป็นใน DOM
  const checkoutButton = document.createElement('button');
  checkoutButton.id = 'checkoutButton';
  document.body.appendChild(checkoutButton);
});

test('should add event listener to checkoutButton', () => {
  // ตรวจสอบว่ามีการสร้าง checkoutButton ใน DOM
  const checkoutButton = document.getElementById('checkoutButton');
  expect(checkoutButton).not.toBeNull(); // ต้องไม่เป็น null
  expect(checkoutButton instanceof HTMLButtonElement).toBe(true); // ตรวจสอบว่าเป็นปุ่มจริงๆ
  
  // ทดสอบว่า addEventListener ถูกเรียกหรือไม่
  const addEventListenerSpy = jest.spyOn(checkoutButton, 'addEventListener');
  
  // เรียกใช้งานฟังก์ชันที่เกี่ยวข้องกับการเพิ่ม event listener
  checkoutButton.click();
  
  // ตรวจสอบว่า addEventListener ถูกเรียกด้วยพารามิเตอร์ที่ถูกต้อง
  expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
});
// Function to add item to cart
function addToCart(id, name, price) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        alert("สินค้านี้อยู่ในรถเข็นแล้ว!"); // Alert if item is already in the cart
        return; // Exit the function if the item is already in the cart
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    updateCartCount();  // Update cart count on the navbar
    displayCart();  // Display cart items in the popup
    animateCartIcon();  // Add animation effect to cart icon
}

// Function to animate cart icon
function animateCartIcon() {
    const cartLink = document.querySelector('.cart-link');
    cartLink.classList.add('highlight');
    setTimeout(() => cartLink.classList.remove('highlight'), 500); // Remove highlight class after animation
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display cart items in the popup
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';  // Clear previous items

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">ไม่มีสินค้าในรถเข็น</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name} - ฿${item.price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="quantity-control">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <p class="cart-item-total">= ฿${itemTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <button class="remove-button" onclick="removeFromCart(${item.id})">ลบ</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    // Format total with commas for Thai Baht
    cartTotal.textContent = total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    displayCart();  // Update display after item removal
}


// Checkout function (currently just clears the cart)
// Function to handle checkout process with Stripe
// ฟังก์ชันที่จะเรียกเมื่อผู้ใช้คลิกปุ่ม checkout
// ฟังก์ชันที่ทำงานเมื่อผู้ใช้คลิกปุ่ม checkout
document.getElementById("checkoutButton").addEventListener("click", function() {
    fetch('http://127.0.0.1:3000/create-checkout-session', {  // ใช้พอร์ต 3000 ที่เซิร์ฟเวอร์ Express รัน
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart })  // ส่งข้อมูลรถเข็นไปยังเซิร์ฟเวอร์
    })
    .then((response) => response.json())
    .then((data) => {
        const stripe = Stripe('pk_test_51QLRDULXE6bgMjnAORtQGcif8tr8KYrFSyybsGtU6R8DNbt93AEOKOgdmEdvMrWXyJeSNRpkqXof8qaSeOjzwOru00eQdAqNEm');  // ใส่ Stripe Public Key ของคุณ
        return stripe.redirectToCheckout({ sessionId: data.id });  // เปลี่ยนเส้นทางไปยัง Stripe Checkout
    })
    .then((result) => {
        if (result.error) {
            alert(result.error.message);  // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
        }
    })
    .catch((error) => console.error('Error:', error));  // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น
});




// Toggle cart popup visibility with bounce effect
function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    const cartLink = document.querySelector('.cart-link');
    
    cartPopup.classList.toggle('show');  // Add or remove 'show' class to toggle visibility
    displayCart();  // Display cart items when the popup is shown

    // Add bounce effect
    cartLink.classList.add('bounce');
    setTimeout(() => cartLink.classList.remove('bounce'), 500); // Remove bounce class after animation
}

// Update cart item count on the navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cartLength = cart.length;

    if (cartLength === 0) {
        cartCount.classList.add('zero');  // Hide the cart count bubble if the cart is empty
    } else {
        cartCount.classList.remove('zero');  // Show the cart count bubble when there are items
        cartCount.textContent = cartLength;  // Update cart item count
        cartCount.classList.add('change');  // Add 'change' class to trigger animation
        // Remove 'change' class after animation ends
        setTimeout(() => cartCount.classList.remove('change'), 500);
    }
}

// Function to increase item quantity
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCartCount();
        displayCart();  // Update display after quantity change
    }
}

// Function to decrease item quantity
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart();
        updateCartCount();
        displayCart();  // Update display after quantity change
    }
}

// Function to update item quantity from input
function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    const quantity = parseInt(newQuantity, 10);

    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart();
        updateCartCount();
        displayCart();  // Update display after quantity change
    }
}

// Add event listener to update total in real-time
document.getElementById('cart-items').addEventListener('input', function(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'number') {
        const itemId = parseInt(event.target.closest('.cart-item').dataset.id, 10);
        updateQuantity(itemId, event.target.value);
    }
});

// Initial cart display and update cart count
displayCart();
updateCartCount();

// Smooth scroll function with offset
document.querySelectorAll('.navbar-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all menu items
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the clicked menu item
        this.classList.add('active');

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight; // Get the height of the navbar
            window.scrollTo({
                top: targetElement.offsetTop - navbarHeight, // Subtract navbar height from target position
                behavior: 'smooth'
            });
        }
    });
});

function toggleMenu() {
    const navbarLinks = document.querySelector('.navbar nav');
    const hamburger = document.querySelector('.hamburger');
    navbarLinks.classList.toggle('open');
    hamburger.classList.toggle('active');

    // Add animation class for smooth transition
    if (navbarLinks.classList.contains('open')) {
        navbarLinks.classList.add('slide-in');
        navbarLinks.classList.remove('slide-out');
    } else {
        navbarLinks.classList.add('slide-out');
        navbarLinks.classList.remove('slide-in');
    }
}
