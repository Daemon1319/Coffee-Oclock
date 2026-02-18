/*
 * DOCU: Handles input validation, user session via URL parameters,
 * form feedback, UI updates, logout, and dropdown/password toggle.
 *
 * Last Updated: 2026-02-13
 * Author: Errol Tabangen
 * Updated By: Errol Tabangen
 */
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

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
    if (error) error.textContent = message;
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
    if (error) error.textContent = "";
    return true;
}

// Input validators
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
    if (value === "") return showError(emailInput, "Email is required");
    if (!value.includes("@")) return showError(emailInput, "Enter a valid email");
    return clearError(emailInput);
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
    if (passwordInput.value.length < 6) return showError(passwordInput, "Password must be at least 6 characters");
    return clearError(passwordInput);
}

/*  
 * DOCU: Handles the signup form submission.
 * Validates inputs and redirects with user name in URL.
 * @param {Event} e - The form submission event.
 * @returns {void}
 *  
 * Last Updated: 2026-02-13 
 * Author: Errol Tabangen  
 * Last Updated By: Errol Tabangen
 */
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        let isValid = true;

        isValid = firstName.value.trim() ? clearError(firstName) && isValid : showError(firstName, "First name is required") && isValid;
        isValid = lastName.value.trim() ? clearError(lastName) && isValid : showError(lastName, "Last name is required") && isValid;
        isValid = validateEmail(email) && isValid;
        isValid = validatePassword(password) && isValid;
        isValid = confirmPassword.value === password.value ? clearError(confirmPassword) && isValid : showError(confirmPassword, "Passwords do not match") && isValid;

        if (!isValid) return;

        // Redirect with user in URL (no storage)
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("user", firstName.value.trim());
        window.location.href = currentUrl.toString();
    });
}


// Login
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email");
        const password = document.getElementById("login-password");

        let isValid = validateEmail(email) && validatePassword(password);
        if (!isValid) return;

        // Redirect with URL using first part of email as placeholder for name
        const firstName = email.value.split("@")[0];
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("user", firstName);
        window.location.href = currentUrl.toString();
    });
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
        if (authLinks) authLinks.style.display = "none";
        if (userProfile) userProfile.style.display = "flex";
        if (userDisplayName) userDisplayName.textContent = currentUser.firstName;
    } else {
        if (authLinks) authLinks.style.display = "flex";
        if (userProfile) userProfile.style.display = "none";
    }
}

updateAuthUI();

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        alert("You have been logged out.");
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("user");
        window.location.href = currentUrl.toString();
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
    document.addEventListener("click", () => dropdownMenu.classList.remove("show"));
}

// Password toggle
const toggleButtons = document.querySelectorAll(".toggle-password");
toggleButtons.forEach(button => {
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
        document.querySelectorAll("a").forEach(link => {
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

window.addEventListener("DOMContentLoaded", updateLinksWithUser);
updateLinksWithUser();
