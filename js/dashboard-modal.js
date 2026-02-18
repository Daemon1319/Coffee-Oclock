// Constants
const signupModal = document.getElementById('signup-modal-container');
const loginModal = document.getElementById('login-modal-container');

const signupBtn = document.querySelector('.signup-link');
const loginBtn = document.querySelector('.login-link');

const closeButtons = document.querySelectorAll('.close-btn');


/*  
 * DOCU: Hides all modal windows and removes the modal-open class from body.
 * @param {void} paramName - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-12  
 * Author: Allan Banzuela  
 * Last Updated By: Jheanne A. Salan  
 */
function hideModals() {
    // remove the animation class so modal fades out
    if (signupModal) signupModal.classList.remove('show');
    if (loginModal) loginModal.classList.remove('show');

    // remove blur + scrolling lock
    document.body.classList.remove('modal-open');
}


/*  
 * DOCU: Shows the signup modal with animation when user clicks SIGN UP.
 * @param {Event} e - The click event from the SIGN UP link/button.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-12  
 * Author: Jheanne A. Salan  
 * Last Updated By: Jheanne A. Salan  
 */
function showSignupModal(e) {
    e.preventDefault(); // so it will not jump to top because of href="#"

    hideModals(); // close others first

    if (signupModal) {
        signupModal.classList.add('show'); // triggers CSS animation
        document.body.classList.add('modal-open');
    }
}


/*  
 * DOCU: Shows the login modal with animation when user clicks LOGIN.
 * @param {Event} e - The click event from the LOGIN link/button.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-12  
 * Author: Jheanne A. Salan  
 * Last Updated By: Jheanne A. Salan  
 */
function showLoginModal(e) {
    e.preventDefault();

    hideModals();

    if (loginModal) {
        loginModal.classList.add('show');
        document.body.classList.add('modal-open');
    }
}


/*  
 * DOCU: Sets up the button clicks for opening and closing modals.
 * @param {void} paramName - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-12  
 * Author: Jheanne A. Salan  
 * Last Updated By: Jheanne A. Salan  
 */
function initializeModalEvents() {
    // make sure modals are hidden when page loads
    hideModals();

    // open modals
    if (signupBtn) signupBtn.addEventListener('click', showSignupModal);
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);

    // close modals when user clicks X button
    closeButtons.forEach(function (btn) {
        btn.addEventListener('click', hideModals);
    });
}


// Run the setup
initializeModalEvents();
