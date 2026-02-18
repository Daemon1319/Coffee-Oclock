/*  
 * DOCU: Handles all shopping cart functionalities including quantity changes, item removal, 
 * total calculation, search/filter, and checkout modal interaction.
 * 
 * Last Updated: 2026-02-14  
 * Author: Janverly  
 * Last Updated By: Janverly  
 */


const cartContainer = document.getElementById('cartContainer');
const itemCountEl = document.getElementById('itemCount'); 
const shippingFeeEl = document.getElementById('shippingFee'); 
const totalAmountCart = document.getElementById('total-amount'); 
const totalAmountModal = document.getElementById('total-amount-modal'); 
const totalAmountEl = document.getElementById('totalAmount'); 
const checkoutBtn = document.getElementById('checkout-button'); 
const searchInput = document.querySelector('.search-bar'); 
const modalContainer = document.getElementById('check-out-modal-container');
const modalCloseBtn = modalContainer.querySelector('.close-btn');

const paymentForm = document.getElementById('payment-form');
const payBtn = document.getElementById('pay-button');
const notification = document.getElementById('notification');

const SHIPPING_FEE = 49;

/*  
 * DOCU: Convert a currency string like "₱100.00" to a number 100  
 * @param {string} str - Currency string to convert  
 * @returns {number} - Numeric value of the currency  
 */
function stringToNumber(str) {
    return parseFloat(str.replace('₱','').replace(/,/g,'')) || 0;
}

function numberToCurrency(num) {
    return `₱${num.toFixed(2)}`;
}

// cart logic
function updateOrderSummary() {
    const cartItems = cartContainer.getElementsByClassName('cart-item');
    let subtotal = 0;
    let itemCount = 0;

    Array.from(cartItems).forEach(item => {
        const qtyEl = item.querySelector('.cart-qty-value');
        const priceEl = item.querySelector('.cart-item-price');
        const totalEl = item.querySelector('.cart-item-total span');
        if (!qtyEl || !priceEl || !totalEl) return;

        let qty = parseInt(qtyEl.textContent) || 1;
        if (qty < 1) qty = 1;

        const price = stringToNumber(priceEl.textContent);

        qtyEl.textContent = qty;
        totalEl.textContent = numberToCurrency(price * qty);

        itemCount += qty;
        subtotal += price * qty;
    });

    const total = subtotal + SHIPPING_FEE;

    if (itemCountEl) itemCountEl.textContent = itemCount;
    if (shippingFeeEl) shippingFeeEl.textContent = numberToCurrency(SHIPPING_FEE);
    if (totalAmountCart) totalAmountCart.textContent = numberToCurrency(subtotal);
    if (totalAmountModal) totalAmountModal.textContent = numberToCurrency(total);
    if (totalAmountEl) totalAmountEl.textContent = numberToCurrency(total);
}


// Cart quantity & remove
cartContainer.addEventListener('click', e => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;

    const qtyEl = cartItem.querySelector('.cart-qty-value');
    let qty = parseInt(qtyEl.textContent) || 1;

    if (e.target.textContent === "−") qty = Math.max(1, qty - 1);
    else if (e.target.textContent === "+") qty += 1;
    else if (e.target.classList.contains('cart-remove-btn')) {
        cartItem.remove();
        updateOrderSummary();
        return;
    }

    qtyEl.textContent = qty;
    updateOrderSummary();
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

// Modal open/close
checkoutBtn.addEventListener('click', () => {
    modalContainer.style.display = 'flex';
    document.body.classList.add('modal-open');
});
modalCloseBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    document.body.classList.remove('modal-open');
});
window.addEventListener('click', e => {
    if (e.target === modalContainer) {
        modalContainer.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});

// Watch for new cart items
const observer = new MutationObserver(() => updateOrderSummary());
observer.observe(cartContainer, { childList: true });

//payment notif success
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    modalContainer.style.display = 'none';
    document.body.classList.remove('modal-open');

    cartContainer.innerHTML = '';
    updateOrderSummary();

    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
});

// Initialize
updateOrderSummary();
