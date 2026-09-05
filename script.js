// Products Database
const products = [
    { id: 1, name: "Premium Lipstick", price: 120, category: "cosmetics", image: "https://via.placeholder.com/200x175?text=Premium+Lipstick" },
    { id: 2, name: "Black Kajal", price: 60, category: "cosmetics", image: "https://via.placeholder.com/200x175?text=Black+Kajal" },
    { id: 3, name: "Vicco Turmeric Skin Cream 15g", price: 78, category: "beauty", image: "<a href="https://ibb.co/xSTyHdK4"><img src="https://i.ibb.co/wNmTsjZv/skin-banner-47b6810b-f3e9-4447-98a8-0100da42eb19.png" alt="skin-banner-47b6810b-f3e9-4447-98a8-0100da42eb19" border="0"></a> " },
    { id: 4, name: "Vicco Turmeric Skin Cream 30g", price: 150, category: "beauty", image: "<a href="https://ibb.co/vFbVBvZ"><img src="https://i.ibb.co/WhQG3pg/file-00000000032882119d95a69ee471c64f.png" alt="file-00000000032882119d95a69ee471c64f" border="0"></a>" },
    { id: 5, name: "White Tone Cream 15g", price: 48, category: "beauty", image: "<a href="https://ibb.co/CyPhg6t"><img src="https://i.ibb.co/4L1Pz2f/White-tone.jpg" alt="White-tone" border="0"></a>" },
    { id: 6, name: "Skin Shine Cream 15g", price: 50, category: "beauty", image: "<a href="https://ibb.co/qYbJkkyH"><img src="https://i.ibb.co/N2wTZZV0/62a218ae343b8.jpg" alt="62a218ae343b8" border="0"></a>" },
    { id: 7, name: "Betanovate-C 30g", price: 80, category: "beauty", image: "<a href="https://ibb.co/Vct00Gdq"><img src="https://i.ibb.co/zTrWWg14/betnovate-c-cream-mainimage-z32tqaeiv0c2cqqmt85plndh.webp" alt="betnovate-c-cream-mainimage-z32tqaeiv0c2cqqmt85plndh" border="0"></a>" },
    { id: 8, name: "Melamine 15g", price: 87, category: "beauty", image: "<a href="https://ibb.co/hJQ630n9"><img src="https://i.ibb.co/v6yF09rq/MEL0195-1.jpg" alt="MEL0195-1" border="0"></a>" },
    { id: 9, name: "Roop Mantra 30g", price: 125, category: "beauty", image: "<a href="https://ibb.co/0ykC0qhG"><img src="https://i.ibb.co/LdMxTSnZ/roop-mantra-ayurvedic-face-cream-new-pack-2.jpg" alt="roop-mantra-ayurvedic-face-cream-new-pack-2" border="0"></a>" },
    { id: 10, name: "Dove Shampoo", price: 95, category: "beauty", image: "<a href="https://ibb.co/Mbsq0c1"><img src="https://i.ibb.co/GX0gSWM/tice-U1-R5-32e1d8a54d244a309adb52d61470a82e.jpg" alt="tice-U1-R5-32e1d8a54d244a309adb52d61470a82e" border="0"></a>" }
];

// Delivery Charges per KM
const DELIVERY_RATE_PER_KM = 10;
const MIN_ORDER = 50;
const OWNER_WHATSAPP = "919129033788"; // WhatsApp number without + sign

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
                    <button class="remove" onclick="removeFromCart(${index})">हटाए���</button>
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

// Calculate Delivery Charge
function calculateDeliveryCharge(distance) {
    return distance * DELIVERY_RATE_PER_KM;
}

// Calculate Total with Delivery
function calculateTotalWithDelivery(distance) {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    if (subtotal < MIN_ORDER) {
        return { subtotal: subtotal, delivery: 0, total: subtotal, message: `₹50 से कम ऑर्डर पर डिलीवरी नहीं है` };
    }
    
    const delivery = calculateDeliveryCharge(distance);
    return { subtotal: subtotal, delivery: delivery, total: subtotal + delivery, message: "" };
}

// Open Checkout Modal
function openCheckout() {
    if (cart.length === 0) {
        alert("कृपया पहले कार्ट में प्रोडक्ट जोड़ें");
        return;
    }
    
    const modal = document.getElementById("checkoutModal");
    if (!modal) {
        createCheckoutModal();
    }
    displayCheckoutSummary(0);
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
            
            <form id="checkoutForm" onsubmit="submitOrder(event)">
                <div class="form-group">
                    <label>आपका नाम</label>
                    <input type="text" id="customerName" required placeholder="पूरा नाम दर्ज करें">
                </div>
                
                <div class="form-group">
                    <label>फोन नंबर</label>
                    <input type="tel" id="customerPhone" required placeholder="10 अंकों का फोन नंबर">
                </div>
                
                <div class="form-group">
                    <label>पता</label>
                    <textarea id="customerAddress" required placeholder="अपना पूरा पता दर्ज करें"></textarea>
                </div>

                <div class="form-group">
                    <label>दूरी (Km में)</label>
                    <input type="number" id="distance" required min="0" placeholder="अपने घर से दूरी दर्ज करें" oninput="updateDeliveryCharge()">
                </div>
                
                <div id="deliveryInfo" class="delivery-status" style="background:#f0f0f0; padding:10px; border-radius:5px; margin-bottom:10px;">
                    <p><strong>डिलीवरी चार्ज:</strong> ₹<span id="deliveryAmount">0</span>/Km</p>
                    <p style="color:#8d0038; font-size:14px;">कुल डिलीवरी: ₹<span id="totalDelivery">0</span></p>
                </div>

                <div id="finalTotal" style="background:#fff2a8; padding:12px; border-radius:5px; margin-bottom:12px; border-left:4px solid #8d0038;">
                    <p style="font-weight:bold; font-size:16px;">अंतिम कुल: ₹<span id="grandTotal">0</span></p>
                </div>
                
                <button type="submit" class="submit-btn">WhatsApp पर ऑर्डर भेजें</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Checkout Summary
function displayCheckoutSummary(distance = 0) {
    let subtotal = 0;
    let summary = "<div class='selected-product'>";
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        summary += `<p>${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}</p>`;
    });
    
    summary += `<hr style="margin:10px 0"><p style="font-weight:bold;">प्रोडक्ट कुल: ₹${subtotal}</p>`;
    summary += "</div>";
    
    document.getElementById("checkoutSummary").innerHTML = summary;
    updateDeliveryCharge();
}

// Update Delivery Charge on distance input
function updateDeliveryCharge() {
    const distanceInput = document.getElementById("distance");
    const distance = distanceInput ? parseFloat(distanceInput.value) || 0 : 0;
    
    const calculation = calculateTotalWithDelivery(distance);
    
    document.getElementById("deliveryAmount").textContent = DELIVERY_RATE_PER_KM;
    document.getElementById("totalDelivery").textContent = calculation.delivery;
    document.getElementById("grandTotal").textContent = calculation.total;
}

// Generate WhatsApp Message
function generateWhatsAppMessage(name, phone, address, distance) {
    let orderDetails = "📦 *नया ऑर्डर*\n\n";
    orderDetails += `👤 नाम: ${name}\n`;
    orderDetails += `📱 फोन: ${phone}\n`;
    orderDetails += `📍 पता: ${address}\n`;
    orderDetails += `📏 दूरी: ${distance} Km\n\n`;
    
    orderDetails += "*🛍️ ऑर्डर की गई वस्तुएं:*\n";
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        orderDetails += `• ${item.name}\n  मात्रा: ${item.quantity}x\n  कीमत: ₹${itemTotal}\n\n`;
    });
    
    const calculation = calculateTotalWithDelivery(distance);
    
    orderDetails += `-------------------\n`;
    orderDetails += `प्रोडक्ट कुल: ₹${calculation.subtotal}\n`;
    orderDetails += `डिलीवरी चार्ज: ₹${calculation.delivery}\n`;
    orderDetails += `*अंतिम कुल: ₹${calculation.total}*\n`;
    
    return encodeURIComponent(orderDetails);
}

// Submit Order via WhatsApp
function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const distance = parseFloat(document.getElementById("distance").value) || 0;
    
    // Validation
    if (!name) {
        alert("कृपया अपना नाम दर्ज करें");
        return;
    }
    
    if (!phone || phone.length !== 10) {
        alert("कृपया सही 10 अंकों का फोन नंबर दर्ज करें");
        return;
    }
    
    if (!address) {
        alert("कृपया अपना पता दर्ज करें");
        return;
    }
    
    if (distance < 0) {
        alert("कृपया सही दूरी दर्ज करें");
        return;
    }
    
    if (cart.length === 0) {
        alert("कार्ट खाली है");
        return;
    }
    
    const calculation = calculateTotalWithDelivery(distance);
    
    // Generate WhatsApp message
    const message = generateWhatsAppMessage(name, phone, address, distance);
    
    // WhatsApp URL
    const whatsappURL = `https://wa.me/${OWNER_WHATSAPP}?text=${message}`;
    
    // Show confirmation
    alert(`✅ आपका ऑर्डर WhatsApp पर भेजा जा रहा है।\n\nनाम: ${name}\nफोन: ${phone}\nदूरी: ${distance} Km\nअंतिम कुल: ₹${calculation.total}`);
    
    // Open WhatsApp
    window.open(whatsappURL, "_blank");
    
    // Clear cart
    cart = [];
    updateCartCount();
    
    // Close modals
    closeModal("checkoutModal");
    closeModal("cartModal");
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
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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
