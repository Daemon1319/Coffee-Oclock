/*
 * DOCU: Handles prefilling and updating user profile information.
 * It retrieves user data from sessionStorage and populates the profile form.
 *
 * Last Updated: 2026-02-18
 * Author: Errol
 */

document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");



    // Get current user from sessionStorage
    let userData = null;
    try {
        userData = JSON.parse(sessionStorage.getItem("organic_shop_user"));
    } catch (e) {
        console.error("Failed to parse user data from storage", e);
    }

    // If not in sessionStorage, try to get from URL and provide fallback
    const urlParams = new URLSearchParams(window.location.search);
    const userNameParam = urlParams.get("user");

    if (!userData && userNameParam) {
        userData = {
            firstName: userNameParam,
            lastName: "",
            fullName: userNameParam,
            email: userNameParam.toLowerCase() + "@example.com"
        };
        sessionStorage.setItem("organic_shop_user", JSON.stringify(userData));
    }

    /*  
     * DOCU: Prefills the input fields with the user's data.
     * @param {Object} data - The user data object.
     * @returns {void}
     * 
     */
    function prefillForm(data) {
        if (!data) return;
        
        let fname = data.firstName;
        let lname = data.lastName;
        
        // If fields are empty but fullName exists, try to derive them
        if ((!fname || !lname) && data.fullName) {
            const parts = data.fullName.trim().split(/\s+/);
            if (!fname) fname = parts[0] || "";
            if (!lname) lname = parts.slice(1).join(" ") || "";
        }

        if (firstNameInput) firstNameInput.value = fname || "";
        if (lastNameInput) lastNameInput.value = lname || "";
        if (emailInput) emailInput.value = data.email || "";
    }

    // Execute prefill
    prefillForm(userData);

    // Handle Account Information form submission
    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            if (!userData && !userNameParam) {
                showNotification("Error", "You must be logged in to update your profile.", "error");
                return;
            }

            const updatedUser = {
                ...(userData || {}),
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                fullName: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
                email: emailInput.value.trim(),
            };

            sessionStorage.setItem("organic_shop_user", JSON.stringify(updatedUser));
            
            // Re-sync the userData variable
            userData = updatedUser;

            showNotification("Success", "Account information updated successfully!", "success", function() {
                // If first name changed, we need to update the URL to maintain "session"
                const currentUrl = new URL(window.location.href);
                if (currentUrl.searchParams.get("user") !== updatedUser.firstName) {
                    currentUrl.searchParams.set("user", updatedUser.firstName);
                    window.location.href = currentUrl.toString();
                }
            });
        });
    }

    // Handle Password Information form submission
    if (passwordForm) {
        passwordForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const currentPassInput = document.getElementById("current_password");
            const newPassInput = document.getElementById("new_password");
            const confirmPassInput = document.getElementById("confirm_password");

            // Use shared validation clear function if available
            if (typeof clearError === "function") {
                clearError(currentPassInput);
                clearError(newPassInput);
                clearError(confirmPassInput);
            }

            let isValid = true;

            // 1. Basic required validation
            if (!currentPassInput.value) {
                if (typeof showError === "function") showError(currentPassInput, "Current password is required");
                isValid = false;
            }
            if (!newPassInput.value) {
                if (typeof showError === "function") showError(newPassInput, "New password is required");
                isValid = false;
            }
            if (!confirmPassInput.value) {
                if (typeof showError === "function") showError(confirmPassInput, "Confirm password is required");
                isValid = false;
            }

            if (!isValid) return;

            // 2. Validate current password against actual password
            // Fallback to "password123" if no password was stored yet
            const actualPassword = userData && userData.password ? userData.password : "password123";
            
            if (currentPassInput.value !== actualPassword) {
                if (typeof showError === "function") showError(currentPassInput, "Incorrect current password");
                return;
            }

            // 3. New password validation
            if (newPassInput.value !== confirmPassInput.value) {
                if (typeof showError === "function") showError(confirmPassInput, "Passwords do not match");
                return;
            }

            if (newPassInput.value.length < 6) {
                if (typeof showError === "function") showError(newPassInput, "Must be at least 6 characters");
                return;
            }

            // If everything is correct
            if (userData) {
                userData.password = newPassInput.value;
                sessionStorage.setItem("organic_shop_user", JSON.stringify(userData));
            }

            showNotification("Success", "Password updated successfully!", "success", function() {
                passwordForm.reset();
            });
        });
    }
});
