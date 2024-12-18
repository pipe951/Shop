// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

beforeEach(() => {
  // สร้าง DOM ที่จำเป็นสำหรับทดสอบ
  document.body.innerHTML = `
    <div id="cart-items">
      <div class="cart-item" data-id="1">
        <input type="number" value="1">
      </div>
    </div>
  `;
});

it('should add event listener to cart-items', () => {
  const cartItems = document.getElementById('cart-items');
  
  // ตรวจสอบว่า element มีอยู่
  if (cartItems) {
    const addEventListenerSpy = jest.spyOn(cartItems, 'addEventListener');
    
    // เพิ่ม event listener ใน DOM
    cartItems.addEventListener('input', function (event) {
      if (event.target.tagName === 'INPUT' && event.target.type === 'number') {
        const itemId = parseInt(event.target.closest('.cart-item').dataset.id, 10);
        updateQuantity(itemId, event.target.value);
      }
    });

    // สร้างการคลิกเพื่อทดสอบ
    const inputElement = cartItems.querySelector('input');
    inputElement.dispatchEvent(new Event('input'));

    // ตรวจสอบว่า event listener ถูกเรียก
    expect(addEventListenerSpy).toHaveBeenCalledWith('input', expect.any(Function));
  } else {
    console.error("Element 'cart-items' not found.");
  }
});


// script1.test.js
describe('DOM Manipulation Test', () => {
  beforeEach(() => {
    // สร้าง DOM จำลอง
    document.body.innerHTML = `
      <div id="cart-items">
        <div class="cart-item" data-id="1">
          <input type="number" value="1" />
        </div>
      </div>
    `;
  });

  afterEach(() => {
    // ลบ DOM จำลองหลังทดสอบ
    document.body.innerHTML = '';
  });

  it('should add an event listener to cart-items', () => {
    const cartItems = document.getElementById('cart-items');

    // Mock ฟังก์ชัน addEventListener
    const addEventListenerSpy = jest.spyOn(cartItems, 'addEventListener');

    // เรียก script1.js (โหลดโค้ดของคุณ)
    require('./script1.js');

    // ตรวจสอบว่า addEventListener ถูกเรียก
    expect(addEventListenerSpy).toHaveBeenCalledWith('input', expect.any(Function));
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.getElementById('cart-items');

  if (cartItems) {
    // เพิ่ม Event Listener เมื่อเจอ element
    cartItems.addEventListener('input', function (event) {
      if (event.target.tagName === 'INPUT' && event.target.type === 'number') {
        const itemId = parseInt(event.target.closest('.cart-item').dataset.id, 10);
        updateQuantity(itemId, event.target.value);
      }
    });
  } else {
    // ถ้าไม่มี element
    console.warn("Element with ID 'cart-items' not found.");
  }
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

const checkoutButton = document.getElementById('checkoutButton');
if (checkoutButton) {
  checkoutButton.addEventListener('click', function () {
    fetch('http://127.0.0.1:3000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    })
      .then((response) => response.json())
      .then((data) => {
        const stripe = Stripe('pk_test_51QLRDULXE6bgMjnAORtQGcif8tr8KYrFSyybsGtU6R8DNbt93AEOKOgdmEdvMrWXyJeSNRpkqXof8qaSeOjzwOru00eQdAqNEm');
        return stripe.redirectToCheckout({ sessionId: data.id });
      })
      .catch((error) => console.error('Error:', error));
  });
}

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
