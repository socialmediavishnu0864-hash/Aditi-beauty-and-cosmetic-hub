// Products Database
const products = [
    { id: 1, name: "Premium Lipstick", price: 120, category: "cosmetics", image: "IMAGE_URL_HERE" },
    { id: 2, name: "Black Kajal", price: 60, category: "cosmetics", image: "IMAGE_URL_HERE" },
    { id: 3, name: "Vicco Turmeric Skin Cream 15g", price: 78, category: "beauty", image: "https://res.cloudinary.com/z59shoo6/image/upload/f_auto,q_auto/file_00000000032882119d95a69ee471c64f" },
    { id: 4, name: "Vicco Turmeric Skin Cream 30g", price: 150, category: "beauty", image: "https://res.cloudinary.com/z59shoo6/image/upload/f_auto,q_auto/file_00000000032882119d95a69ee471c64f" },
    { id: 5, name: "White Tone Cream 15g", price: 48, category: "beauty", image: "https://kommodo.ai/i/zTsR999v8oejqbQaaQ5i" },
    { id: 6, name: "Skin Shine Cream 15g", price: 50, category: "beauty", image: "https://kommodo.ai/i/C93jsplDlIgI0uJjMTT6" },
    { id: 7, name: "Betanovate-C 30g", price: 80, category: "beauty", image: "https://kommodo.ai/i/tKWVSxntRTmNg1gissDz" },
    { id: 8, name: "Melamine 15g", price: 87, category: "beauty", image: "https://kommodo.ai/i/QxcUCBG6DiTcZlghqCxj" },
    { id: 9, name: "Roop Mantra 30g", price: 125, category: "beauty", image: "https://kommodo.ai/i/NRy5bLu5JezvQrZk" },
    { id: 10, name: "Dove Shampoo", price: 95, category: "beauty", image: "https://kommodo.ai/i/4xKFzNaDzgBeLdaFRMgb" }
];

// Cart Array
let cart = [];
let currentCategory = "all";

// Search Products
function searchProducts() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const allProducts = document.querySelectorAll(".product");
    
    allProducts.forEach(product => {
        const productName = product.getAttribute("data-name").toLowerCase();
        if (productName.includes(searchInput)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Filter by Category
function filterCategory(category, button) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll(".categories button").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");
    
    // Filter products
    const allProducts = document.querySelectorAll(".product");
    allProducts.forEach(product => {
        const productCategory = product.getAttribute("data-category");
        
        if (category === "all" || productCategory === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Add to Cart
function addToCart(productName, price) {
    const item = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    };
    
    // Check if product already in cart
    const existingItem = cart.find(p => p.name.toLowerCase() === productName.toLowerCase());
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    updateCartCount();
    showNotification(`${productName} कार्ट में जोड़ा गया`);
}

// Buy Now
function buyNow(productName, price) {
    addToCart(productName, price);
    openCheckout();
}

// Open Cart Modal
function openCart() {
    const modal = document.getElementById("cartModal");
    if (!modal) {
        createCartModal();
    }
    displayCart();
    document.getElementById("cartModal").style.display = "block";
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Create Cart Modal
function createCartModal() {
    const modal = document.createElement("div");
    modal.id = "cartModal";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-box">
            <span class="close" onclick="closeModal('cartModal')">&times;</span>
            <h2>🛒 आपकी कार्ट</h2>
            <div id="cartItems"></div>
            <div class="cart-total">कुल: ₹<span id="totalPrice">0</span></div>
            <button class="checkout-btn" onclick="openCheckout()">आगे बढ़ें</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Cart
function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p style="text-align:center; color:#999;">कार्ट खाली है</p>`;
        return;
    }
    
    let cartHTML = "";
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-top">
                    <div class="cart-item-name">${item.name}</div>
                    <div>₹${item.price}</div>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove" onclick="removeFromCart(${index})">हटाएं</button>
                </div>
                <div style="text-align:right; font-weight:bold;">कुल: ₹${itemTotal}</div>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = cartHTML;
    document.getElementById("totalPrice").textContent = total;
}

// Update Quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        displayCart();
        updateCartCount();
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
    updateCartCount();
}

// Update Cart Count
function updateCartCount() {
    const cartButton = document.querySelector(".cart-button");
    const cartCount = document.querySelector(".cart-count");
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    
    if (cart.length === 0) {
        cartCount.style.display = "none";
    } else {
        cartCount.style.display = "flex";
    }
}

// Open Checkout Modal
function openCheckout() {
    const modal = document.getElementById("checkoutModal");
    if (!modal) {
        createCheckoutModal();
    }
    displayCheckoutSummary();
    document.getElementById("checkoutModal").style.display = "block";
}

// Create Checkout Modal
function createCheckoutModal() {
    const modal = document.createElement("div");
    modal.id = "checkoutModal";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-box">
            <span class="close" onclick="closeModal('checkoutModal')">&times;</span>
            <h2>💳 चेकआउट</h2>
            <div id="checkoutSummary"></div>
            
            <form id="checkoutForm">
                <div class="form-group">
                    <label>आपका नाम</label>
                    <input type="text" required placeholder="पूरा नाम दर्ज करें">
                </div>
                
                <div class="form-group">
                    <label>फोन नंबर</label>
                    <input type="tel" required placeholder="10 अंकों का फोन नंबर">
                </div>
                
                <div class="form-group">
                    <label>पता</label>
                    <textarea required placeholder="अपना पूरा पता दर्ज करें"></textarea>
                </div>
                
                <div class="form-group">
                    <label>शहर</label>
                    <input type="text" required placeholder="शहर का नाम">
                </div>
                
                <div class="form-group">
                    <label>पिन कोड</label>
                    <input type="text" required placeholder="6 अंकों का पिन कोड">
                </div>
                
                <div id="deliveryInfo" class="delivery-status"></div>
                <button type="submit" class="submit-btn" onclick="submitOrder(event)">ऑर्डर प्लेस करें</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Checkout Summary
function displayCheckoutSummary() {
    let total = 0;
    let summary = "<div class='selected-product'>";
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        summary += `<p>${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}</p>`;
    });
    
    summary += `<hr style="margin:10px 0"><p style="font-weight:bold;">कुल: ₹${total}</p>`;
    summary += `<p style="color:#666; font-size:12px;">₹50 से अधिक की खरीदारी पर 10/Km डिलीवरी</p>`;
    summary += "</div>";
    
    document.getElementById("checkoutSummary").innerHTML = summary;
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector("input[type='text']").value;
    const phone = form.querySelector("input[type='tel']").value;
    const address = form.querySelector("textarea").value;
    
    if (name && phone && address && phone.length === 10) {
        alert(`आपका ऑर्डर सफलतापूर्वक प्लेस हो गया!\n\nनाम: ${name}\nफोन: ${phone}\n\nहम जल्द ही आपसे संपर्क करेंगे।`);
        
        // Clear cart
        cart = [];
        updateCartCount();
        
        // Close modals
        closeModal("checkoutModal");
        closeModal("cartModal");
        
        // Reset form
        form.reset();
    } else {
        alert("कृपया सभी जानकारी सही तरीके से भरें");
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #8d0038;
        color: #fff;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById("cartModal");
    const checkoutModal = document.getElementById("checkoutModal");
    
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }
}

// Initialize cart button
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
});
