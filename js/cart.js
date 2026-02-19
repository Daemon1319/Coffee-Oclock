// Constants
const cartContainer = document.getElementById('cartContainer');
const itemCountEl = document.getElementById('itemCount');
const shippingFeeEl = document.getElementById('shippingFee');
const totalAmountModal = document.getElementById('total-amount-modal');
const totalAmountEl = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.querySelector('.search-bar');
const modalContainer = document.getElementById('check-out-modal-container');
const modalCloseBtn = modalContainer.querySelector('.close-btn');

const paymentForm = document.getElementById('paymentForm');
const shippingInfoForm = document.getElementById('shippingForm');
const checkoutMethodInputs = document.querySelectorAll('input[name="checkout-method"]');
const cardNameInput = document.getElementById('card-name');
const cardNumberInput = document.getElementById('card-number');
const expirationInput = document.getElementById('expiration');
const cvcInput = document.getElementById('cvc');
const cardDetailsFields = document.getElementById('card-details-fields');
const nonCardMessage = document.getElementById('non-card-message');
const paymentDetailsTitle = document.getElementById('payment-details-title');
const cardBrandLogo = document.getElementById('card-brand-logo');
const payButton = document.querySelector('#paymentForm .pay-button');
const aside = document.querySelector("aside nav ul");

const SHIPPING_FEE = 49;

if (shippingInfoForm) {
    const shippingNumberInputs = shippingInfoForm.querySelectorAll('input[type="number"]');
    const zipInput = shippingInfoForm.querySelector('input[name="zip"]');

    shippingNumberInputs.forEach(input => {
        input.setAttribute('min', '0');

        input.addEventListener('keydown', function (e) {
            if (e.key === '-' || e.key === 'Minus') {
                e.preventDefault();
            }
        });

        input.addEventListener('input', function () {
            const value = Number(this.value);

            if (this.value !== '' && value < 0) {
                this.value = '0';
            }
        });
    });

    if (zipInput) {
        zipInput.addEventListener('keydown', function (e) {
            if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                e.preventDefault();
            }
        });

        zipInput.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}

if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function () {
        this.value = formatCardNumber(this.value);
        validateCardNumber();
    });
}

if (expirationInput) {
    expirationInput.addEventListener('input', function () {
        this.value = formatExpiration(this.value);
        validateExpiration();
    });
}

if (cvcInput) {
    cvcInput.addEventListener('input', function () {
        this.value = digitsOnly(this.value).slice(0, 4);
        validateCvc();
    });
}

if (cardNameInput) {
    cardNameInput.addEventListener('input', function () {
        validateCardName();
    });
}

[cardNameInput, cardNumberInput, expirationInput, cvcInput].forEach((input) => {
    if (!input) {
        return;
    }
    input.addEventListener('blur', function () {
        validatePaymentForm();
    });
});

if (checkoutMethodInputs.length > 0) {
    checkoutMethodInputs.forEach((input) => {
        input.addEventListener('change', function () {
            updateCheckoutMethodUI(this.value);
        });
    });
}

// Cart quantity & remove
cartContainer.addEventListener('click', e => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) {
        return;
    }

    const index = parseInt(cartItem.dataset.index);
    const qtyEl = cartItem.querySelector('.cart-qty-value');
    let qty = parseInt(qtyEl.value) || 1;

    if (e.target.classList.contains('qty-btn-minus') || e.target.textContent === "-" || e.target.textContent === "âˆ’") {
        if (qty <= 1) {
            return;
        }
        updateCartStorage(index, qty - 1);
    }
    else if (e.target.classList.contains('qty-btn-plus') || e.target.textContent === "+") {
        updateCartStorage(index, qty + 1);
    }
    else if (e.target.classList.contains('cart-remove-btn') || e.target.textContent === "Ã—") { // &times; is Ã—
        const itemName = cartItem.querySelector('h3')?.textContent?.trim() || "this item";
        showNotification(
            "Remove Drink",
            `Are you sure you want to remove ${itemName} from your cart?`,
            "warning",
            function () {
                updateCartStorage(index, 0, true); // explicit removal
            },
            {
                showCancel: true,
                confirmText: "Remove",
                cancelText: "Cancel"
            }
        );
    }
});

// Search cart items
searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const cartItems = cartContainer.getElementsByClassName('cart-item');
    Array.from(cartItems).forEach(item => {
        const itemName = item.querySelector('h3')?.textContent.toLowerCase() || '';
        item.style.display = itemName.includes(query) ? 'flex' : 'none';
    });
});

//payment notif success
if (paymentForm) {
    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedMethod = getSelectedCheckoutMethod();

        if (!validatePaymentForm()) {
            return;
        }

        modalContainer.style.display = 'none';
        document.body.classList.remove('modal-open');

        // Clear cart
        clearCartStorage();
        updateCartCountBadge();
        loadCart();

        // Show Success Notification
        const methodLabelMap = {
            gcash: 'GCash',
            card: 'Credit/Debit Card',
            cod: 'Cash on Delivery'
        };
        const methodLabel = methodLabelMap[selectedMethod] || 'your selected method';
        showNotification("Order Successful!", `Your order has been placed successfully via ${methodLabel}.`);
    });
}

// Observe the aside element for any changes (like login re-rendering links)
if (aside) {
    const observer = new MutationObserver(() => {
        forceNavLinksTransparent();
    });
    observer.observe(aside, { childList: true, subtree: true });
}

updateCheckoutMethodUI();

// Run on initial load
forceNavLinksTransparent();

// Initialize
checkUrlForNewItem();
loadCart();


/*  
 * DOCU: Convert a currency string like "â‚±100.00" to a number 100  
 * @param {string} str - Currency string to convert  
 * @returns {number} - Numeric value of the currency  
 */
function stringToNumber(str) {
    if (typeof str === 'number') {
        return str;
    }
    return parseFloat(str.replace('â‚±', '').replace('$', '').replace(/,/g, '')) || 0;
}

/*  
 * DOCU: Converts a number to a Philippine Peso currency string.
 * @param {number} num - The numeric amount to format.
 * @returns {string} - Formatted currency string (e.g., "â‚±100.00").
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function numberToCurrency(num) {
    return `â‚±${num.toFixed(2)}`;
}

/*  
 * DOCU: Removes all non-digit characters from a string.
 * @param {string} value - Input string that may contain non-numeric characters.
 * @returns {string} - Digits-only string.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function digitsOnly(value) {
    return value.replace(/\D/g, '');
}

/*  
 * DOCU: Formats a card number into groups of four digits.
 * @param {string} value - Raw card number input.
 * @returns {string} - Formatted card number with spaces.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function formatCardNumber(value) {
    const digits = digitsOnly(value).slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/*  
 * DOCU: Formats expiration input into MM/YY format.
 * @param {string} value - Raw expiration input value.
 * @returns {string} - Expiration value in MM/YY format.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function formatExpiration(value) {
    const digits = digitsOnly(value).slice(0, 4);
    if (digits.length <= 2) {
        return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/*  
 * DOCU: Performs a Luhn algorithm check for card number validity.
 * @param {string} cardDigits - Digits-only card number.
 * @returns {boolean} - True if the card number passes Luhn check; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function luhnCheck(cardDigits) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardDigits.length - 1; i >= 0; i -= 1) {
        let digit = parseInt(cardDigits.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}


/*  
 * DOCU: Validates the cardholder name input.
 * @param {void} - No parameters.
 * @returns {boolean} - True if card name is valid; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function validateCardName() {
    if (!cardNameInput) {
        return true;
    }

    const value = cardNameInput.value.trim();
    cardNameInput.setCustomValidity('');

    if (!value) {
        cardNameInput.setCustomValidity('Card name is required.');
        return false;
    }

    if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(value)) {
        cardNameInput.setCustomValidity('Enter a valid card name.');
        return false;
    }

    return true;
}

/*  
 * DOCU: Validates the card number input including Luhn check.
 * @param {void} - No parameters.
 * @returns {boolean} - True if card number is valid; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function validateCardNumber() {
    if (!cardNumberInput) {
        return true;
    }

    const digits = digitsOnly(cardNumberInput.value);
    cardNumberInput.setCustomValidity('');

    if (!digits) {
        cardNumberInput.setCustomValidity('Card number is required.');
        return false;
    }

    if (digits.length !== 16) {
        cardNumberInput.setCustomValidity('Card number must be 16 digits.');
        return false;
    }

    if (!luhnCheck(digits)) {
        cardNumberInput.setCustomValidity('Enter a valid card number.');
        return false;
    }

    return true;
}

/*  
 * DOCU: Validates the card expiration date and checks if it is not expired.
 * @param {void} - No parameters.
 * @returns {boolean} - True if expiration is valid; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function validateExpiration() {
    if (!expirationInput) {
        return true;
    }

    const value = expirationInput.value.trim();
    expirationInput.setCustomValidity('');

    if (!value) {
        expirationInput.setCustomValidity('Expiration date is required.');
        return false;
    }

    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) {
        expirationInput.setCustomValidity('Use MM/YY format.');
        return false;
    }

    const month = parseInt(match[1], 10);
    const year = 2000 + parseInt(match[2], 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        expirationInput.setCustomValidity('Card is expired.');
        return false;
    }

    return true;
}

/*  
 * DOCU: Validates the CVC input field.
 * @param {void} - No parameters.
 * @returns {boolean} - True if CVC is valid; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function validateCvc() {
    if (!cvcInput) {
        return true;
    }

    const digits = digitsOnly(cvcInput.value);
    cvcInput.setCustomValidity('');

    if (!digits) {
        cvcInput.setCustomValidity('CVC is required.');
        return false;
    }

    if (!/^\d{3,4}$/.test(digits)) {
        cvcInput.setCustomValidity('CVC must be 3 or 4 digits.');
        return false;
    }

    return true;
}

/*  
 * DOCU: Validates the payment form fields based on selected checkout method.
 * @param {void} - No parameters.
 * @returns {boolean} - True if payment form is valid; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function validatePaymentForm() {
    const selectedMethod = getSelectedCheckoutMethod();
    if (!isCardMethod(selectedMethod)) {
        return true;
    }

    const validators = [
        { input: cardNameInput, validate: validateCardName },
        { input: cardNumberInput, validate: validateCardNumber },
        { input: expirationInput, validate: validateExpiration },
        { input: cvcInput, validate: validateCvc }
    ];

    let isValid = true;

    validators.forEach(({ input, validate }) => {
        const currentValid = validate();
        if (!currentValid && isValid && input) {
            input.reportValidity();
        }
        isValid = currentValid && isValid;
    });

    return isValid;
}

/*  
 * DOCU: Gets the currently selected checkout payment method.
 * @param {void} - No parameters.
 * @returns {string} - Selected checkout method value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function getSelectedCheckoutMethod() {
    const selected = document.querySelector('input[name="checkout-method"]:checked');
    return selected ? selected.value : 'cod';
}

/*  
 * DOCU: Checks whether the selected payment method requires card details.
 * @param {string} method - Selected payment method.
 * @returns {boolean} - True if card details are required; otherwise false.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function isCardMethod(method) {
    return method === 'card';
}

/*  
 * DOCU: Sets the required state of card input fields.
 * @param {boolean} isRequired - Required flag to apply to card fields.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function setCardFieldRequired(isRequired) {
    [cardNameInput, cardNumberInput, expirationInput, cvcInput].forEach((input) => {
        if (!input) {
            return;
        }
        input.required = isRequired;
        input.setCustomValidity('');
    });
}

/*  
 * DOCU: Clears all card input field values and validation messages.
 * @param {void} - No parameters.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function clearCardFields() {
    [cardNameInput, cardNumberInput, expirationInput, cvcInput].forEach((input) => {
        if (!input) {
            return;
        }
        input.value = '';
        input.setCustomValidity('');
    });
}

/*  
 * DOCU: Updates checkout UI elements based on selected payment method.
 * @param {string} method - Optional method to apply immediately.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function updateCheckoutMethodUI(method) {
    const selectedMethod = method || getSelectedCheckoutMethod();
    const needsCard = isCardMethod(selectedMethod);

    if (cardDetailsFields) {
        cardDetailsFields.style.display = needsCard ? 'flex' : 'none';
    }

    if (nonCardMessage) {
        nonCardMessage.classList.toggle('show', !needsCard);
        if (selectedMethod === 'cod') {
            nonCardMessage.textContent = 'Cash on Delivery selected. Please prepare the exact amount upon delivery.';
        } else if (selectedMethod === 'gcash') {
            nonCardMessage.textContent = 'GCash selected. You can complete payment after placing the order.';
        }
    }

    if (paymentDetailsTitle) {
        paymentDetailsTitle.textContent = needsCard ? 'Card Details' : 'Payment Details';
    }

    if (cardBrandLogo) {
        cardBrandLogo.style.display = needsCard ? 'block' : 'none';
    }

    if (payButton) {
        payButton.textContent = needsCard ? 'Pay' : 'Place Order';
    }

    if (!needsCard) {
        clearCardFields();
    }

    setCardFieldRequired(needsCard);
}

// cart logic
/*  
 * DOCU: Loads cart items from storage and renders them in the cart list.
 * @param {void} - No parameters.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function loadCart() {
    const cart = getCartFromStorage();
    const params = new URLSearchParams(window.location.search);
    const userName = params.get('user');
    const dashboardHref = userName
        ? `dashboard.html?user=${encodeURIComponent(userName)}`
        : 'dashboard.html';
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-state">
                <p class="empty-cart-msg">Nothing here yet. Start ordering.</p>
                <a href="${dashboardHref}" class="cart-btn">See our Menu</a>
            </div>
        `;
        updateOrderSummary();
        return;
    }

    cart.forEach((item, index) => {
        const safeQty = Math.max(1, parseInt(item.quantity) || 1);

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.index = index;

        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <span class="cart-item-price">â‚±${Number(item.price).toFixed(2)}</span>
            </div>
            <div class="cart-qty">
                <label>Quantity</label>
                <button type="button" class="qty-btn-minus" ${safeQty <= 1 ? 'disabled' : ''}>-</button>
                <input type="text" class="cart-qty-value" value="${safeQty}" readonly>
                <button type="button" class="qty-btn-plus">+</button>
            </div>
            <div class="cart-item-total">
                <label>Total</label>
                <span>â‚±${(item.price * safeQty).toFixed(2)}</span>
            </div>
            <button type="button" class="cart-remove-btn">&times;</button>
        `;
        cartContainer.appendChild(li);
    });

    updateOrderSummary();
}

/*  
 * DOCU: Updates the cart in storage with a new quantity or item removal.
 * @param {number} index - Index of the cart item to update.
 * @param {number} newQty - New quantity value.
 * @param {boolean} allowRemove - Whether removing item at zero quantity is allowed.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function updateCartStorage(index, newQty, allowRemove) {
    allowRemove = Boolean(allowRemove);
    const cart = getCartFromStorage();

    if (index >= 0 && index < cart.length) {
        if (allowRemove && newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = Math.max(1, parseInt(newQty) || 1);
        }

        setCartToStorage(cart);
    }

    updateCartCountBadge();
    loadCart();
}

/*  
 * DOCU: Recalculates and updates item count, shipping fee, and total amount.
 * @param {void} - No parameters.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function updateOrderSummary() {
    const cartItems = cartContainer.getElementsByClassName('cart-item');
    let subtotal = 0;
    let itemCount = 0;

    Array.from(cartItems).forEach(item => {
        const qtyEl = item.querySelector('.cart-qty-value');
        const priceEl = item.querySelector('.cart-item-price');
        const totalEl = item.querySelector('.cart-item-total span');
        if (!qtyEl || !priceEl || !totalEl) {
            return;
        }

        let qty = parseInt(qtyEl.value) || 1; // Changed to .value for input
        const price = stringToNumber(priceEl.textContent);

        totalEl.textContent = `â‚±${(price * qty).toFixed(2)}`;

        itemCount += qty;
        subtotal += price * qty;
    });

    const appliedShippingFee = itemCount >= 1 ? SHIPPING_FEE : 0;
    const total = subtotal + appliedShippingFee;

    if (itemCountEl) {
        itemCountEl.textContent = itemCount;
    }
    if (shippingFeeEl) {
        shippingFeeEl.textContent = numberToCurrency(appliedShippingFee);
    }
    if (totalAmountModal) {
        totalAmountModal.textContent = numberToCurrency(total);
    }
    if (totalAmountEl) {
        totalAmountEl.textContent = numberToCurrency(total);
    }
}

/*
 * DOCU: Checks URL query parameters for an "add" action and adds the item to the cart.
 * Uses products.data.js to fetch product details.
 */
function checkUrlForNewItem() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const id = parseInt(params.get('id'));
    const qty = parseInt(params.get('qty'));

    if (action === 'add' && !isNaN(id) && !isNaN(qty) && qty > 0) {
        if (typeof findProductById !== 'function') {
            console.error("findProductById is not defined. Make sure products.data.js is included.");
            return;
        }

        const product = findProductById(id);

        if (product) {
            let cart = getCartFromStorage();
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += qty;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: qty
                });
            }
            setCartToStorage(cart);
            updateCartCountBadge();

            const url = new URL(window.location);
            url.searchParams.delete('action');
            url.searchParams.delete('id');
            url.searchParams.delete('qty');
            window.history.replaceState({}, '', url);
        }
    }
}

/*  
 * DOCU: Forces dashboard sidebar link background to remain transparent on cart page.
 * @param {void} - No parameters.
 * @returns {void} - Does not return a value.
 *
 * Last Updated: 2026-02-18  
 * Author: Kerzania  
 */
function forceNavLinksTransparent() {
    const links = document.querySelectorAll('aside nav ul li a[href="dashboard.html"]');
    links.forEach(link => {
        link.style.backgroundColor = "transparent";
    });
}

