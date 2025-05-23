document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const YOUR_PORTFOLIO_URL = "https://example.com/yourportfolio"; // REPLACE THIS

    // --- ELEMENTS ---
    const cookieConsentBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    const productGrid = document.getElementById('product-grid');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountNavElement = document.getElementById('cart-count-nav');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clear-cart-button');
    const newsletterForm = document.getElementById('newsletter-form');

    // Checkout page elements
    const orderSummaryItemsContainer = document.getElementById('order-summary-items');
    const summarySubtotalElement = document.getElementById('summary-subtotal');
    const summaryShippingElement = document.getElementById('summary-shipping');
    const summaryTotalElement = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');

    // --- Product Data (Hardcoded) ---
    const products = [
    { id: 1, name: "Eco-Friendly Organic Tee", price: 22.99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8qnsptwkB85bV5D7oVLRI_H9N-ozksJueQ&s", defaultSize: "M" },
    
    { id: 2, name: "Retro Graphic Tee", price: 27.99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2q2u9HGachrWpxc4B0iqpD6Wp2QFgNQyvdg&s", defaultSize: "L" },
    
    { id: 3, name: "Oversized Vintage Tee", price: 31.99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNliuSvf_2EZwpWCcVgIa2HJsiIddrQWE_FA&s", defaultSize: "S" },
    
    { id: 4, name: "Tie-Dye Casual Tee", price: 24.49, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInt5b6WBwZKCMyegdVkLtV5QWoAM8mDnc-w&s", defaultSize: "M" },
    
    { id: 5, name: "Graphic Print Tee", price: 25.49, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzC9mK3pO5Y_ngr_fbA5XqtEBT5pkF9Vax9j5PjklNXGAw2KiCb0KhSTgEklPb72sjjUw&usqp=CAU", defaultSize: "XL" },
    
    { id: 6, name: "Minimalist Design Tee", price: 23.00, image: "https://mir-s3-cdn-cf.behance.net/projects/404/8c575a210921779.Y3JvcCwxMTUwLDkwMCwxMjgsMA.jpg", defaultSize: "S" },
    
    { id: 7, name: "Pocket Detail Tee", price: 26.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGkZGChL0cqaCHCNkhx27K70ZPLHliyRIRNQ&s", defaultSize: "L" },
    
    { id: 8, name: "Layered Long Sleeve Tee", price: 30.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxvFuuer3VhbhcroSV4vS98DFFP_qpsD3_3g&s", defaultSize: "M" },
];

    // --- CART STATE ---
    let cart = [];

    // --- FUNCTIONS ---

    // Cookie Consent
    function showCookieBanner() {
        if (cookieConsentBanner) cookieConsentBanner.classList.remove('hidden');
    }
    function hideCookieBanner() {
        if (cookieConsentBanner) cookieConsentBanner.classList.add('hidden');
    }
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
    }
    function checkCookieConsent() {
        if (localStorage.getItem('cookieConsent') !== 'accepted') {
            showCookieBanner();
        }
        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', acceptCookies);
        }
    }

    // Product Rendering
    function renderProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = ''; // Clear loading message
        products.forEach(product => {
            const productCard = `
                <div class="card card-compact bg-base-100 shadow-xl transition-transform hover:scale-105">
                    <figure class="h-64 overflow-hidden"><img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover"/></figure>
                    <div class="card-body">
                        <h2 class="card-title text-lg">${product.name}</h2>
                        <p class="text-xl font-semibold text-primary">$${product.price.toFixed(2)}</p>
                        <div class="form-control w-full max-w-xs my-2">
                          <label class="label">
                            <span class="label-text">Pick a size</span>
                          </label>
                          <select class="select select-bordered select-sm product-size-select" data-product-id="${product.id}">
                            <option>S</option>
                            <option selected>M</option>
                            <option>L</option>
                            <option>XL</option>
                          </select>
                        </div>
                        <div class="card-actions justify-end">
                            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productGrid.innerHTML += productCard;
        });

        // Add event listeners to new "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const product = products.find(p => p.id === productId);
                const sizeSelect = e.target.closest('.card-body').querySelector('.product-size-select');
                const selectedSize = sizeSelect ? sizeSelect.value : product.defaultSize;

                if (product) {
                    addToCart(product, selectedSize);
                }
            });
        });
    }

    // Cart Functions
    function addToCart(product, size) {
        const cartItemIdentifier = `${product.id}-${size}`;
        const existingItem = cart.find(item => item.identifier === cartItemIdentifier);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, size: size, quantity: 1, identifier: cartItemIdentifier });
        }
        saveCartToLocalStorage();
        updateCartDisplay();
    }

    function removeFromCart(itemIdentifier) {
        cart = cart.filter(item => item.identifier !== itemIdentifier);
        saveCartToLocalStorage();
        updateCartDisplay();
    }

    function updateCartItemQuantity(itemIdentifier, newQuantity) {
        const item = cart.find(item => item.identifier === itemIdentifier);
        if (item) {
            item.quantity = parseInt(newQuantity);
            if (item.quantity <= 0) {
                removeFromCart(itemIdentifier);
            } else {
                saveCartToLocalStorage();
                updateCartDisplay();
            }
        }
    }
    
    function clearCart() {
        cart = [];
        saveCartToLocalStorage();
        updateCartDisplay();
    }


    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCartDisplay() {
        // For products.html sidebar cart
        if (cartItemsContainer && cartTotalElement) {
            cartItemsContainer.innerHTML = ''; // Clear existing items
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
                if(checkoutButton) checkoutButton.classList.add('disabled');
            } else {
                cart.forEach(item => {
                    const cartItemElement = `
                        <div class="flex justify-between items-start p-2 bg-base-100 rounded-md shadow">
                            <div>
                                <h3 class="font-semibold text-sm">${item.name} (Size: ${item.size})</h3>
                                <p class="text-xs text-gray-600">$${item.price.toFixed(2)} each</p>
                                 <div class="flex items-center mt-1">
                                    <label for="qty-${item.identifier}" class="text-xs mr-1">Qty:</label>
                                    <input type="number" id="qty-${item.identifier}" value="${item.quantity}" min="1" class="input input-xs input-bordered w-16 quantity-input" data-identifier="${item.identifier}">
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
                                <button class="btn btn-xs btn-error btn-outline mt-1 remove-from-cart-btn" data-identifier="${item.identifier}">Remove</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.innerHTML += cartItemElement;
                });
                if(checkoutButton) checkoutButton.classList.remove('disabled');

                // Add event listeners for new remove buttons and quantity inputs
                document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                    button.addEventListener('click', (e) => removeFromCart(e.target.dataset.identifier));
                });
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', (e) => updateCartItemQuantity(e.target.dataset.identifier, e.target.value));
                });
            }
            cartTotalElement.textContent = `$${calculateTotal().toFixed(2)}`;
        }

        // For checkout.html order summary
        if (orderSummaryItemsContainer && summarySubtotalElement && summaryTotalElement) {
            orderSummaryItemsContainer.innerHTML = '';
             if (cart.length === 0) {
                orderSummaryItemsContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty. Add items from the products page.</p>';
            } else {
                cart.forEach(item => {
                    const summaryItemElement = `
                        <div class="flex justify-between items-center py-2 border-b border-base-300">
                            <div>
                                <p class="font-medium">${item.name} (Size: ${item.size})</p>
                                <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                            </div>
                            <p class="font-medium">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    `;
                    orderSummaryItemsContainer.innerHTML += summaryItemElement;
                });
            }
            const subtotal = calculateTotal();
            const shippingCost = cart.length > 0 ? 5.00 : 0.00; // Example shipping
            summarySubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            if (summaryShippingElement) summaryShippingElement.textContent = `$${shippingCost.toFixed(2)}`;
            summaryTotalElement.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
        }
        
        // Update cart count in navbar
        if (cartCountNavElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountNavElement.textContent = totalItems;
        }
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('trendyTeesCart', JSON.stringify(cart));
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('trendyTeesCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    // Newsletter Form
    function handleNewsletterSubmit(event) {
        event.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && emailInput.value) {
            alert(`Thank you for subscribing with ${emailInput.value}!`);
            emailInput.value = '';
        }
    }
    
    // Checkout Form
    function handleCheckoutSubmit(event) {
        event.preventDefault();
        if (cart.length === 0) {
            alert("Your cart is empty. Please add some products before checking out.");
            window.location.href = 'products.html';
            return;
        }
        // Basic validation example
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;

        if(fullName && email && address) {
            alert("Order Placed Successfully! (This is a demo)");
            clearCart(); // Clear cart after "successful" order
            window.location.href = 'index.html'; // Redirect to home
        } else {
            alert("Please fill in all required shipping details.");
        }
    }

    // Update current year in footer
    function updateFooterYear() {
        const yearElements = document.querySelectorAll('#current-year');
        yearElements.forEach(el => el.textContent = new Date().getFullYear());
    }

    // Update Developer Profile Link
    function updateDevProfileLink() {
        const devLinks = document.querySelectorAll('a[href="YOUR_PORTFOLIO_URL_HERE"]');
        devLinks.forEach(link => link.href = YOUR_PORTFOLIO_URL);
    }


    // --- INITIALIZATION & EVENT LISTENERS ---
    updateFooterYear();
    updateDevProfileLink();
    checkCookieConsent();
    loadCartFromLocalStorage();

    if (productGrid) { // Only render products if on products page
        renderProducts();
    }
    
    updateCartDisplay(); // Update cart display on all pages (for navbar count and checkout page)

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

});