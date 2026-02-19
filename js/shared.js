// Constant
const CART_URL_PARAM = 'cart';

// Event Trigger
document.addEventListener("DOMContentLoaded", function () {
    loadModals();
    initHamburgerMenu();
    initSideNavActiveState();
    syncCartParamToLinks();
    updateCartCountBadge();
});

/*  
 * DOCU: Formats a number as a Philippine Peso currency string.
 * @param {number} amount - The numeric amount.
 * @returns {string} - Formatted string like "â‚±100.00".
 * @throws {None} - No exceptions.
 *  
 * Last Updated: 2026-02-15
 * Author: Kerzania
 * Last Updated by: Kerzania
 */
function formatPrice(amount) {
    return `â‚±${Number(amount).toFixed(2)}`;
}

/*  
 * DOCU: Reads and parses the cart array from the URL query parameter.
 * @param {void} - No parameters.
 * @returns {Array} - Returns cart items if valid; otherwise an empty array.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function getCartFromStorage() {
    const params = new URLSearchParams(window.location.search);
    const rawCart = params.get(CART_URL_PARAM);

    if (!rawCart) {
        return [];
    }

    const trimmed = rawCart.trim();
    const looksLikeArray = trimmed.startsWith('[') && trimmed.endsWith(']');
    if (!looksLikeArray) {
        return [];
    }

    const parsedCart = JSON.parse(trimmed);
    return Array.isArray(parsedCart) ? parsedCart : [];
}

/*  
 * DOCU: Saves cart items into the URL query parameter and updates internal links.
 * @param {Array} cart - Cart array to persist in the URL.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function setCartToStorage(cart) {
    const safeCart = Array.isArray(cart) ? cart : [];
    const url = new URL(window.location.href);

    if (safeCart.length > 0) {
        url.searchParams.set(CART_URL_PARAM, JSON.stringify(safeCart));
    } else {
        url.searchParams.delete(CART_URL_PARAM);
    }

    window.history.replaceState({}, '', url.toString());
    syncCartParamToLinks();
}

/*  
 * DOCU: Clears cart data from the URL query parameter and updates internal links.
 * @param {void} - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function clearCartStorage() {
    const url = new URL(window.location.href);
    url.searchParams.delete(CART_URL_PARAM);
    window.history.replaceState({}, '', url.toString());
    syncCartParamToLinks();
}

/*  
 * DOCU: Synchronizes the current cart query parameter value to all internal links.
 * @param {void} - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function syncCartParamToLinks() {
    const currentUrl = new URL(window.location.href);
    const cartValue = currentUrl.searchParams.get(CART_URL_PARAM);

    document.querySelectorAll('a[href]').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) {
            return;
        }

        if (typeof URL.canParse === 'function' && !URL.canParse(href, window.location.origin)) {
            return;
        }

        const url = new URL(href, window.location.origin);
        if (url.protocol !== window.location.protocol || url.host !== window.location.host) {
            return;
        }

        if (cartValue) {
            url.searchParams.set(CART_URL_PARAM, cartValue);
        } else {
            url.searchParams.delete(CART_URL_PARAM);
        }

        link.href = url.toString();
    });
}

/*  
 * DOCU: Computes the total cart item count by summing valid item quantities.
 * @param {void} - No parameters.
 * @returns {number} - Total quantity of items currently in cart.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function getCartItemCount() {
    const cart = getCartFromStorage();

    return cart.reduce(function (sum, item) {
        const qty = Number(item && item.quantity);
        return sum + (Number.isFinite(qty) ? qty : 0);
    }, 0);
}

/*  
 * DOCU: Updates all cart count badges in the UI based on current cart quantity.
 * @param {void} - No parameters.
 * @returns {void} - Does not return anything.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: Kerzania
 */
function updateCartCountBadge() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    if (!cartCountElements.length) {
        return;
    }

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

/* ============= SIDENAV ACTIVE STATE ============= */

/*  
 * DOCU: Applies active state styling to the sidebar nav link of the current page.
 * @param {void} - No parameters.
 * @returns {void} - Does not return any value.
 * @throws {None} - No exceptions are explicitly thrown.
 *  
 * Last Updated: 2026-02-19
 * Author: 
 * Last Updated by: 
 */
function initSideNavActiveState() {
    const navLinks = document.querySelectorAll('aside nav ul li a[href]');
    if (!navLinks.length) {
        return;
    }

    const currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();

    navLinks.forEach(function (link) {
        const href = (link.getAttribute('href') || '').split('?')[0];
        const linkPage = href.split('/').pop().toLowerCase();

        link.classList.remove('active');
        link.removeAttribute('aria-current');

        if (linkPage && linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
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
    if (existing) {
        existing.remove();
    }

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "notification-modal";
    overlay.className = "notification-overlay active";

    // Create content container
    const content = document.createElement("div");
    content.className = "notification-content notification-" + type;

    /*  
     * DOCU: Closes notification modal and optionally executes callback.
     * @param {boolean} shouldRunCallback - Whether to run onClose callback.
     * @returns {void} - Does not return any value.
     * @throws {None} - No exceptions are explicitly thrown.
     *  
     * Last Updated: 2026-02-19
     * Author: Kerzania
     * Last Updated by: Kerzania
     */
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


