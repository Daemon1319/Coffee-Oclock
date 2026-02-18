// Constants
const cartModal = document.getElementById('check-out-modal-container');
const cartBtn = document.getElementById('checkoutBtn');
const closeCartBtn = document.querySelector('.close-btn');

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
cartBtn.addEventListener('click', function () {
    hideCartModal();
    if (cartModal) {
        cartModal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
});

// Hide cart modal when close button is clicked
closeCartBtn.addEventListener('click', hideCartModal);