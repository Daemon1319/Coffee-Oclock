# Organic Shop Repo Project Structure

```
project-root/
│
├── dashboard.html          (Product listing, home)  //index
├── product-view.html       (Single product page, related products)
├── cart.html               (Cart page, shipping, order summary)
│
├── css/
│   ├── shared-components.css (Shared layout, overlay, modals, notifications, utilities)
│   ├── dashboard.css         (Dashboard-specific styles)
│   ├── product-view.css      (Product view-specific styles)
│   ├── cart.css              (Cart-specific styles)
│   └── modals/               (Modal styles)
│      ├─ login.css
│      ├─ signup.css
│      └─ check-out.css
│
├── js/
│   ├── shared.js             (Shared utilities: hamburger menu, modals injection, notifications, formatPrice, getCartFromStorage)
│   ├── dashboard.js          (Product grid, categories, search, pagination)
│   ├── product-view.js       (Product detail, similar items, quantity, add-to-cart, search)
│   ├── cart.js               (Cart CRUD, order summary, checkout flow)
│   ├── cart-modal.js         (Checkout payment modal open/close)
│   ├── dashboard-modal.js    (Signup/login modal open/close)
│   ├── input-validation.js   (Form validation, auth UI, session, avatar dropdown, password toggle)
│   └── products.data.js      (Product data array and helpers)
│
└── assets/
     ├── img/
     ├── products/
     │   └── product-images/
     └── icons/

```
