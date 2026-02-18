/*
 * DOCU: Handles opening and closing of signup/login modals.
 * Deferred to DOMContentLoaded since modals are injected dynamically by shared.js.
 *
 * Last Updated: 2026-02-15
 * Author: Allan Banzuela
 * Last Updated By: Jheanne A. Salan
 */

document.addEventListener("DOMContentLoaded", function () {
    const signupModal = document.getElementById('signup-modal-container');
    const loginModal = document.getElementById('login-modal-container');
    const signupBtn = document.querySelector('.signup-link');
    const loginBtn = document.querySelector('.login-link');
    const toLoginBtn = document.getElementById('to-login-btn');
    const toSignupBtn = document.getElementById('to-signup-btn');
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
        if (signupModal) signupModal.classList.remove('show');
        if (loginModal) loginModal.classList.remove('show');
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
        e.preventDefault();
        hideModals();
        if (signupModal) {
            signupModal.classList.add('show');
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
        hideModals();
        if (signupBtn) signupBtn.addEventListener('click', showSignupModal);
        if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
        if (toLoginBtn) toLoginBtn.addEventListener('click', showLoginModal);
        if (toSignupBtn) toSignupBtn.addEventListener('click', showSignupModal);
        closeButtons.forEach(function (btn) {
            btn.addEventListener('click', hideModals);
        });
    }

    initializeModalEvents();
});
