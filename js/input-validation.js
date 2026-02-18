/*
 * DOCU: Handles input validation, user session via URL parameters,
 * form feedback, UI updates, logout, and dropdown/password toggle.
 * Deferred to DOMContentLoaded since modals are injected by shared.js.
 *
 * Last Updated: 2026-02-15
 * Author: Errol Tabangen
 * Updated By: Errol Tabangen
 */

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("user");
let currentUser = userName ? { firstName: userName } : null;

/*  
 * DOCU: Finds the error element associated with a given input field.
 * @param {HTMLElement} input - The input element to find the error message container for.
 * @returns {HTMLElement|null} - The error element if found, otherwise null.
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function getErrorElement(input) {
    const parent = input.closest("div");
    let error = parent.querySelector(".error");
    if (!error && parent.parentElement) {
        error = parent.parentElement.querySelector(".error");
    }
    return error;
}

/*  
 * DOCU: Displays an error message for a specific input field.
 * @param {HTMLElement} input - The input element where the error occurred.
 * @param {string} message - The error message to display.
 * @returns {boolean} - Always returns false (to indicate invalid status).
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function showError(input, message) {
    const error = getErrorElement(input);
    const inputGroup = input.closest(".input-group");

    if (error) {
        error.textContent = message;
        error.classList.add("show");
    }

    if (inputGroup) inputGroup.classList.add("has-error");
    input.classList.add("is-invalid");
    return false;
}

/*  
 * DOCU: Clears the error message for a specific input field.
 * @param {HTMLElement} input - The input element to clear the error for.
 * @returns {boolean} - Always returns true (to indicate valid status).
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function clearError(input) {
    const error = getErrorElement(input);
    const inputGroup = input.closest(".input-group");

    if (error) {
        error.textContent = "";
        error.classList.remove("show");
    }

    if (inputGroup) inputGroup.classList.remove("has-error");
    input.classList.remove("is-invalid");
    return true;
}

/*  
 * DOCU: Validates an email input field.
 * @param {HTMLElement} emailInput - The email input element to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function validateEmail(emailInput) {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (value === "") return showError(emailInput, "Email is required");
    if (!emailRegex.test(value)) return showError(emailInput, "Enter a valid email (e.g., user@example.com)");
    return clearError(emailInput);
}

/*
 * DOCU: Validates that a required input is not empty.
 * @param {HTMLElement} input - The input element to validate.
 * @param {string} message - The message to display if empty.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
function validateRequired(input, message) {
    if (input.value.trim() === "") return showError(input, message);
    return clearError(input);
}

/*  
 * DOCU: Validates a password input field.
 * @param {HTMLElement} passwordInput - The password input element to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function validatePassword(passwordInput) {
    const value = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (value.trim() === "") {
        return showError(passwordInput, "Password is required");
    }

    if (value.length < 6) {
        return showError(passwordInput, "Password must be at least 6 characters");
    }
    if (!passwordRegex.test(value)) {
        return showError(passwordInput, "Password must include uppercase, lowercase, number, and special character");
    }
    return clearError(passwordInput);
}

/*  
 * DOCU: Updates the authentication UI based on the current user state.
 * Toggles visibility of login/signup links and user profile.
 * @returns {void}
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function updateAuthUI() {
    const authLinks = document.getElementById("auth-links");
    const userProfile = document.getElementById("user-profile");
    const userDisplayName = document.getElementById("user-display-name");

    if (currentUser) {
        if (authLinks) authLinks.classList.add("hidden");
        if (userProfile) userProfile.classList.remove("hidden");
        if (userDisplayName) userDisplayName.textContent = currentUser.firstName;
    } else {
        if (authLinks) authLinks.classList.remove("hidden");
        if (userProfile) userProfile.classList.add("hidden");
    }
}

/*  
 * DOCU: Automatically appends the current user's name to all internal links.
 * Ensures the session persists across page navigation by updating URL parameters.
 * @returns {void}
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
function updateLinksWithUser() {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");

    if (user) {
        document.querySelectorAll("a").forEach(function (link) {
            if (link.href && !link.getAttribute("href").startsWith("#")) {
                try {
                    const url = new URL(link.href, window.location.origin);
                    if (url.protocol === window.location.protocol && url.host === window.location.host) {
                        url.searchParams.set("user", user);
                        link.href = url.toString();
                    }
                } catch (e) {
                    console.error("Invalid URL:", link.href);
                }
            }
        });
    }
}

// Run auth UI immediately (header exists in static HTML)
updateAuthUI();

document.addEventListener("DOMContentLoaded", function () {
    // Forms are now injected by shared.js, so query them here
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const firstName = document.getElementById("first-name");
            const lastName = document.getElementById("last-name");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirm-password");

            let isValid = true;

            isValid = validateRequired(firstName, "First name is required") && isValid;
            isValid = validateRequired(lastName, "Last name is required") && isValid;
            isValid = validateEmail(email) && isValid;
            isValid = validatePassword(password) && isValid;
            isValid = validateRequired(confirmPassword, "Confirm password is required") && isValid;

            if (confirmPassword.value.trim() !== "" && password.value.trim() !== "") {
                isValid = confirmPassword.value === password.value ? clearError(confirmPassword) && isValid : showError(confirmPassword, "Passwords do not match") && isValid;
            }

            if (!isValid) return;

            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("user", firstName.value.trim());
            window.location.href = currentUrl.toString();
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("login-email");
            const password = document.getElementById("login-password");

            let isValid = validateEmail(email) && validatePassword(password);
            if (!isValid) return;

            const firstName = email.value.split("@")[0];
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("user", firstName);
            window.location.href = currentUrl.toString();
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            showNotification("Logged Out", "You have been logged out.", "info", function () {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete("user");
                window.location.href = currentUrl.toString();
            });
        });
    }

    // Avatar dropdown
    const avatar = document.getElementById("avatar");
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (avatar && dropdownMenu) {
        avatar.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });
        document.addEventListener("click", function () {
            dropdownMenu.classList.remove("show");
        });
    }

    // Password toggle
    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const input = document.getElementById(this.dataset.target);
            if (!input) return;
            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Hide";
            } else {
                input.type = "password";
                this.textContent = "Show";
            }
        });
    });

    // Update links with user param
    updateLinksWithUser();
    updateAuthUI();
});
