/*
 * DOCU: Shared utilities used across all pages.
 * Contains: loadModals, showNotification, hamburger menu, formatPrice, getCartFromStorage.
 *
 * Last Updated: 2026-02-15
 */

/* ============= FORMAT PRICE ============= */

/*  
 * DOCU: Formats a number as a Philippine Peso currency string.
 * @param {number} amount - The numeric amount.
 * @returns {string} - Formatted string like "₱100.00".
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-15
 * Author: Kerzania
 * Last Updated by: Kerzania
 */
function formatPrice(amount) {
    return `₱${Number(amount).toFixed(2)}`;
}

/* ============= CART STORAGE ============= */

/*  
 * DOCU: Reads the cart array from sessionStorage.
 * @param {void} - No parameters.
 * @returns {Array} - Array of cart item objects.
 * @throws {None} - Catches and logs JSON parse errors.
 *  
 * Last Updated: 2026-02-15
 * Author: Kerzania
 * Last Updated by: Kerzania
 */
const CART_STORAGE_KEY = 'organic_shop_cart';

function getCartFromStorage() {
    try {
        return JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
        console.error("Failed to read cart from storage:", e);
        return [];
    }
}

function setCartToStorage(cart) {
    try {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart || []));
    } catch (e) {
        console.error("Failed to write cart to storage:", e);
    }
}

function clearCartStorage() {
    try {
        sessionStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
        console.error("Failed to clear cart storage:", e);
    }
}

function getCartItemCount() {
    const cart = getCartFromStorage();

    return cart.reduce(function (sum, item) {
        const qty = Number(item && item.quantity);
        return sum + (Number.isFinite(qty) ? qty : 0);
    }, 0);
}

function updateCartCountBadge() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    if (!cartCountElements.length) return;

    const itemCount = getCartItemCount();
    cartCountElements.forEach(function (el) {
        el.textContent = itemCount;
    });
}

/* ============= HAMBURGER MENU ============= */

/*  
 * DOCU: Initializes and controls the hamburger menu toggle behavior.
 * It listens for clicks on the menu button to open/close the sidebar drawer,
 * and listens for clicks on the overlay to close the sidebar.
 *  
 * @param {none} - This block does not accept any parameters.
 * @returns {void} - Does not return any value.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-15
 * Author: Jheanne A. Salan
 * Last Updated By: Jheanne A. Salan
 */
function initHamburgerMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const overlay = document.getElementById("sidebar-overlay");

    if (menuBtn && overlay) {
        menuBtn.addEventListener("click", function () {
            document.body.classList.toggle("menu-open");
        });

        overlay.addEventListener("click", function () {
            document.body.classList.remove("menu-open");
        });
    }
}

/* ============= NOTIFICATION MODAL ============= */

/*  
 * DOCU: Shows a notification modal with the given title and message.
 * Creates the DOM elements dynamically using CSS classes from shared-components.css.
 * @param {string} title - The notification heading (e.g., "Order Successful!").
 * @param {string} message - The notification body text.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-15
 * Author: Kerzania
 * Last Updated by: Kerzania
 */
function showNotification(title, message, type, onClose, options) {
    // Default type to "success" if not provided
    type = type || "success";
    options = options || {};
    const showCancel = Boolean(options.showCancel);
    const confirmText = options.confirmText || "OK";
    const cancelText = options.cancelText || "Cancel";

    // Map type to icon class and CSS modifier
    var iconMap = {
        success: "bi bi-check-circle-fill",
        warning: "bi bi-exclamation-triangle-fill",
        error: "bi bi-x-circle-fill",
        info: "bi bi-info-circle-fill"
    };

    // Remove any existing notification
    const existing = document.getElementById("notification-modal");
    if (existing) existing.remove();

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "notification-modal";
    overlay.className = "notification-overlay active";

    // Create content container
    const content = document.createElement("div");
    content.className = "notification-content notification-" + type;

    function closeNotification(shouldRunCallback) {
        overlay.remove();
        if (shouldRunCallback && typeof onClose === "function") {
            onClose();
        }
    }

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "notification-close-btn";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close notification");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", function () {
        closeNotification(!showCancel);
    });

    // Icon
    const icon = document.createElement("div");
    icon.className = "notification-icon";
    icon.innerHTML = '<i class="' + (iconMap[type] || iconMap.success) + '"></i>';

    // Title
    const heading = document.createElement("h3");
    heading.className = "notification-title";
    heading.textContent = title;

    // Message
    const text = document.createElement("p");
    text.className = "notification-text";
    text.textContent = message;

    // OK button
    const btn = document.createElement("button");
    btn.className = "notification-btn";
    btn.textContent = confirmText;
    btn.addEventListener("click", function () {
        closeNotification(true);
    });

    const actions = document.createElement("div");
    actions.className = "notification-actions";

    if (showCancel) {
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "notification-btn notification-btn-secondary";
        cancelBtn.type = "button";
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener("click", function () {
            overlay.remove();
            if (typeof options.onCancel === "function") {
                options.onCancel();
            }
        });

        actions.appendChild(cancelBtn);
    }

    actions.appendChild(btn);

    content.appendChild(closeBtn);
    content.appendChild(icon);
    content.appendChild(heading);
    content.appendChild(text);
    content.appendChild(actions);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}

/* ============= LOAD MODALS ============= */

/*  
 * DOCU: Injects the signup and login modal HTML into the DOM.
 * This is the single source of truth for modal markup.
 * @param {void} - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-15
 * Author: Kerzania
 * Last Updated by: Kerzania
 */
function loadModals() {
    const modalsHTML = `
    <!-- Signup modal -->
    <div id="signup-modal-container">
        <div id="signup-container">
            <button class="close-btn" type="button">&times;</button>
            <div class="signup-information">
                <div class="signup-text">
                    <h2><i class="bi bi-emoji-smile"> </i>Sign up to order.</h2>
                    <button type="button" id="to-login-btn">Already a member? Log in here.</button>
                </div>

                <form id="signup-form">
                    <div class="signup-form-row">
                        <div class="input-group">
                            <input id="first-name" name="first-name" type="text">
                            <label for="first-name">First Name</label>
                            <small class="error"></small>
                        </div>
                        <div class="input-group">
                            <input id="last-name" name="last-name" type="text">
                            <label for="last-name">Last Name</label>
                            <small class="error"></small>
                        </div>
                    </div>

                    <div class="signup-form-column">
                        <div class="input-group">
                            <input id="email" name="email" type="email" >
                            <label for="email">Email</label>
                            <small class="error"></small>
                        </div>
                        <div class="input-group">
                            <input id="password" name="password" type="password" >
                            <label for="password">Password</label>
                            <button type="button" class="toggle-password" data-target="password">Show</button>
                            <small class="error"></small>
                        </div>
                        <div class="input-group">
                            <input id="confirm-password" name="confirm-password" type="password" >
                            <label for="confirm-password">Confirm Password</label>
                            <button type="button" class="toggle-password" data-target="confirm-password">Show</button>
                            <small class="error"></small>
                        </div>
                    </div>
                    <div class="underline"></div>

                    <button type="submit">Sign up</button>
                </form>
            </div>
            <img src="assets/img/coffee-bg.jpg" alt="Coffee background" class="side-image-sign">
        </div>
    </div>

    <!-- Login modal -->
    <div id="login-modal-container">
        <div id="login-container">
            <button class="close-btn" type="button">&times;</button>
            <div class="login-information">
                <div class="login-text">
                    <h2><i class="bi bi-emoji-smile"></i> Log in to order.</h2>
                    <button type="button" id="to-signup-btn">New member? Register here.</button>
                </div>

                <form id="login-form">
                    <div class="input-group">
                        <input type="email" id="login-email" name="email">
                        <label for="login-email">Email</label>
                        <small class="error"></small>
                    </div>

                    <div class="input-group">
                        <input type="password" id="login-password" name="password">
                        <label for="login-password">Password</label>
                        <button type="button" class="toggle-password" data-target="login-password">Show</button>
                        <small class="error"></small>
                    </div>

                    <div class="underline"></div>

                    <button type="submit">Log in</button>
                </form>
            </div>
            <img src="assets/img/coffee-login-bg.jpg" alt="Coffee login background" class="side-image">
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalsHTML);
}

/* ============= INITIALIZATION ============= */

document.addEventListener("DOMContentLoaded", function () {
    loadModals();
    initHamburgerMenu();
    updateCartCountBadge();

    window.addEventListener('storage', function (event) {
        if (event.key === CART_STORAGE_KEY) {
            updateCartCountBadge();
        }
    });
});
