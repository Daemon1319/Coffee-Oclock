// Constants
const cartModal = document.getElementById('check-out-modal-container');
const cartBtn = document.getElementById('checkoutBtn');
const closeCartBtn = cartModal ? cartModal.querySelector('.close-btn') : null;
const shippingForm = document.getElementById('shippingForm');

function validateShippingField(input) {
    if (!input) return true;

    const value = input.value.trim();
    const fieldName = input.getAttribute('name');
    input.setCustomValidity('');

    if (input.hasAttribute('required') && value === '') {
        input.setCustomValidity('This field is required.');
        return false;
    }

    if (!value) return true;

    const nameFields = ['firstName', 'lastName', 'city', 'province'];
    if (nameFields.includes(fieldName) && !/^[A-Za-z ]+$/.test(value)) {
        input.setCustomValidity('Only letters and spaces are allowed.');
        return false;
    }

    if (fieldName === 'zip' && !/^\d{4}$/.test(value)) {
        input.setCustomValidity('Zip code must be exactly 4 digits.');
        return false;
    }

    return true;
}

function validateShippingForm() {
    if (!shippingForm) return true;

    const fields = shippingForm.querySelectorAll('input');
    let isValid = true;

    fields.forEach((input) => {
        const currentValid = validateShippingField(input);
        if (!currentValid && isValid) {
            input.reportValidity();
        }
        isValid = currentValid && isValid;
    });

    return isValid;
}

/*  
 * DOCU: Hides the cart modal and removes the modal-open class from body
 * @returns {void}
 *  
 * Last Updated: 2026-02-12 
 * Author: Allan Banzuela  
 * Last Updated By: Allan Banzuela
 */
function hideCartModal() {
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    document.body.classList.remove('modal-open');
}

// Hide cart modal on initial load
hideCartModal();

// Show cart modal when CHECK OUT is clicked
if (shippingForm) {
    const shippingInputs = shippingForm.querySelectorAll('input');
    shippingInputs.forEach((input) => {
        input.addEventListener('input', function () {
            validateShippingField(this);
        });

        input.addEventListener('blur', function () {
            if (!validateShippingField(this)) {
                this.reportValidity();
            }
        });
    });
}

if (cartBtn) {
    cartBtn.addEventListener('click', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get("user");

        if (!userName) {
            showNotification("Login Required", "Please log in or sign up to proceed to checkout.", "warning");
            return;
        }

        const cart = getCartFromStorage();
        if (cart.length === 0) {
            showNotification("Empty Cart", "Your cart is empty! Please add items to your cart before checking out.", "warning");
            return;
        }

        // Validate shipping form first
        if (!validateShippingForm()) {
            return;
        }

        hideCartModal();
        if (cartModal) {
            cartModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    });
}

// Hide cart modal when close button is clicked
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', hideCartModal);
}