// ====== PROFILE.JS ======

// ===== DOM ELEMENTS =====
const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const usernameInput = document.getElementById("username");

const userDisplayName = document.getElementById("user-display-name");
const avatar = document.getElementById("avatar");
const userProfileContainer = document.getElementById("user-profile");
const logoutBtn = document.getElementById("logout-btn");

// ===== SESSION STORAGE SIMULATION =====
let userSession = {};

// Load session from sessionStorage if exists
if (sessionStorage.getItem("userSession")) {
    userSession = JSON.parse(sessionStorage.getItem("userSession"));
}

// If URL contains ?user=..., use that as the logged-in username when no session exists
const urlParams = new URLSearchParams(window.location.search);
const userFromUrl = urlParams.get('user');
if (userFromUrl && !userSession.username) {
    userSession.username = userFromUrl;
    userSession.fullname = userSession.fullname || userFromUrl;
    userSession.email = userSession.email || (userFromUrl + '@example.com');
    userSession.phone = userSession.phone || '';
    userSession.avatar = userSession.avatar || 'assets/icons/default-avatar.png';
    sessionStorage.setItem('userSession', JSON.stringify(userSession));
}

// Redirect if no session
if (!userSession.username) {
    window.location.href = "login.html";
}

// ===== FUNCTIONS =====
function renderProfile() {
    fullnameInput.value = userSession.fullname || "";
    emailInput.value = userSession.email || "";
    phoneInput.value = userSession.phone || "";
    usernameInput.value = userSession.username || "";

    userDisplayName.textContent = userSession.username || "";
    avatar.src = userSession.avatar || "assets/icons/default-avatar.png";
    userProfileContainer.classList.toggle("hidden", !userSession.username);
}

function saveProfile(data) {
    userSession = { ...userSession, ...data };
    sessionStorage.setItem("userSession", JSON.stringify(userSession));
    renderProfile();
}

function clearSession() {
    sessionStorage.removeItem("userSession");
    window.location.href = "login.html";
}

function showAlert(message) {
    alert(message);
}

// ===== EVENT LISTENERS =====
if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const username = usernameInput.value.trim();

        if (!fullname || !email || !phone || !username) {
            showAlert("Please fill in all fields.");
            return;
        }

        saveProfile({ fullname, email, phone, username, avatar: userSession.avatar });
        showAlert("Profile saved successfully!");
    });
}

if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const current = document.getElementById("current_password").value.trim();
        const newPass = document.getElementById("new_password").value.trim();
        const confirmPass = document.getElementById("confirm_password").value.trim();

        if (!current || !newPass || !confirmPass) {
            showAlert("Please fill in all password fields.");
            return;
        }

        if (userSession.password && current !== userSession.password) {
            showAlert("Current password is incorrect.");
            return;
        }

        if (newPass !== confirmPass) {
            showAlert("New password and confirm password do not match.");
            return;
        }

        userSession.password = newPass;
        sessionStorage.setItem("userSession", JSON.stringify(userSession));
        showAlert("Password updated successfully!");
        passwordForm.reset();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", clearSession);
}

    function forceNavLinksTransparent() {
        const links = document.querySelectorAll('aside nav ul li a[href="cart.html"], aside nav ul li a[href="dashboard.html"]');
        links.forEach(link => {
            link.style.backgroundColor = "transparent"; // inline style
        });
    }

    // Run on initial load
    forceNavLinksTransparent();

    // Observe the aside element for any changes (like login re-rendering links)
    const aside = document.querySelector("aside nav ul");
    if (aside) {
        const observer = new MutationObserver(() => {
            forceNavLinksTransparent();
        });
        observer.observe(aside, { childList: true, subtree: true });
    }


renderProfile();
