// Constants
const productContainer = document.querySelector(".product-grid");
const productLength = document.querySelector(".count");
const paginationContainer = document.querySelector(".pagination");

const categoryList = document.getElementById("categories-list");
const searchBar = document.querySelector(".search-bar");

const PAGE_SIZE = 8;

// Event triggers / initializers
searchBar.addEventListener("input", searchFilter);
renderCategories();
goToPage(1);
updateCartCountBadge();

/*  
 * DOCU: Renders category buttons into the categories list container.
 * It counts products per category and dynamically creates each category item in the sidebar.
 * Also applies an "active" state to the clicked category button for UI feedback.
 *  
 * @param {none} - This function does not accept any parameter.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *  
 * Last Updated: 2026-02-15  
 * Author: Allan Banzuela  
 * Last Updated By: Jheanne Salan  
 */
function renderCategories() {
    if (!categoryList) {
        return;
    }

    const categories = { all: { count: 0 } }; // Added ALL as a category

    getProducts().forEach(product => {
        categories.all.count++;

        if (!categories[product.category]) {
            categories[product.category] = { count: 1 };
        } else {
            categories[product.category].count++;
        }
    });

    categoryList.innerHTML = "";

    Object.keys(categories).forEach(category => {
        const categoryItem = document.createElement("li");
        const categoryButton = document.createElement("button");
        categoryItem.appendChild(categoryButton);

        const categoryName = document.createElement("span");
        const categoryCount = document.createElement("span");
        categoryButton.append(categoryName, categoryCount);

        categoryName.innerText = category
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        categoryCount.innerText = categories[category].count;

        // Set default active button to "all"
        if (category === "all") {
            categoryButton.classList.add("active");
        }

        categoryButton.addEventListener("click", function () {
            // remove active from all category buttons
            document.querySelectorAll("#categories-list button").forEach(btn => {
                btn.classList.remove("active");
            });

            // add active to the clicked one
            categoryButton.classList.add("active");

            // filter products
            if (category === "all") {
                goToPage(1);
            } else {
                categoryFilter(category);
            }
        });

        categoryList.appendChild(categoryItem);
    });
}

/*  
 * DOCU: Filters products by the selected category and re-renders the product grid.
 * It loops through all products, keeps only those matching the given category,
 * updates the product count text, and calls renderProducts with the filtered list.
 * @param {string} category - The category key to filter products by.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *  
 * Last Updated: 2026-02-14  
 * Author: Allan Banzuela  
 * Last Updated By: Allan Banzuela  
 */
function categoryFilter(category) {

    const products = getProducts();
    const filtered = [];

    products.forEach(function (product) {
        if (product.category === category) {
            filtered.push(product);
        }
    });

    goToPage(1, filtered);
}

/*  
 * DOCU: Filters products by the search input value and re-renders the product grid.
 * It compares the search term against product names (case-insensitive),
 * updates the product count text, and calls renderProducts with the matching list.
 * @param {none} - This function does not accept any parameter.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *  
 * Last Updated: 2026-02-14  
 * Author: Allan Banzuela  
 * Last Updated By: Allan Banzuela  
 */
function searchFilter() {
    const rawSearchValue = searchBar.value.trim();
    const searchTerm = rawSearchValue.toLowerCase();

    // If search bar is empty, go back to paginated view
    if (searchTerm === "") {
        goToPage(1);
        return;
    }

    const products = getProducts();
    const filtered = [];

    products.forEach(function (product) {
        if (product.name.toLowerCase().includes(searchTerm)) {
            filtered.push(product);
        }
    });

    if (filtered.length === 0) {
        renderNoSearchResults(rawSearchValue);
        return;
    }

    goToPage(1, filtered);
}

/*
 * DOCU: Shows an empty-state message when no products match the search term.
 * @param {string} searchValue - The raw value from the search input.
 * @returns {void}
 * 
 * Last Updated: 2026-02-17  
 * Author: Kerzania  
 * Last Updated By: Kerzania  
 */
function renderNoSearchResults(searchValue) {
    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    const message = document.createElement("p");
    message.className = "search-empty-state";
    message.textContent = '"' + searchValue + '" is not a product in the store';

    productContainer.appendChild(message);

    if (productLength) {
        productLength.innerText = "(0)";
    }

    if (paginationContainer) {
        paginationContainer.innerHTML = "";
    }
}



/*  
 * DOCU: Renders product cards into the dashboard product grid container.
 * @param {Array<Object>} products - List of products to render.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *  
 * Last Updated: 2026-02-13  
 * Author: Kerzania  
 * Last Updated By: Kerzania  
 */
function renderProducts(products) {

    if (!productContainer) {
        return;
    }

    // Clear existing products first if there is (for safety)
    productContainer.innerHTML = "";

    products.forEach(function (product) {

        const card = document.createElement("a");
        card.href = `product-view.html?id=${product.id}`;
        const thumbDiv = document.createElement("div");
        const image = document.createElement("img");
        thumbDiv.appendChild(image);
        const infoDiv = document.createElement("div");
        const infoDetails = document.createElement("div");
        const name = document.createElement("h3");
        const meta = document.createElement("p");
        infoDetails.append(name, meta);
        const price = document.createElement("p");
        infoDiv.append(infoDetails, price);
        const addToCartBtn = document.createElement("button");
        card.append(thumbDiv, infoDiv, addToCartBtn);

        card.classList.add("product-card");
        thumbDiv.classList.add("product-thumb");
        image.classList.add("product-image");
        infoDiv.classList.add("product-info");
        infoDetails.classList.add("info-details");
        name.classList.add("product-name");
        meta.classList.add("product-meta");
        price.classList.add("product-price");
        addToCartBtn.classList.add("add-to-cart-btn");
        addToCartBtn.type = "button";

        // Set the content of each element
        image.src = product.image || DEFAULT_PRODUCT_IMAGE_SRC;
        image.alt = product.name;
        name.innerText = product.name;
        meta.innerHTML = `${renderStarsHTML(product.stars)} â€¢ ${product.ratings} Ratings`;
        price.innerText = `â‚±${Number(product.price).toFixed(2)}`;
        addToCartBtn.innerHTML = '<i class="bi bi-cup-hot"></i> Add to Order';
        addToCartBtn.setAttribute("aria-label", `Add ${product.name} to order`);
        addToCartBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            addToCart(product.id);
        });

        // Append to container
        productContainer.appendChild(card);
    });
}

/*  
* DOCU: Returns the full list of products from the shared PRODUCTS data source.
* This function acts as a single access point so other functions do not directly
* depend on the PRODUCTS variable everywhere.
*  
* @param {none} - This function does not accept any parameter.
* @returns {Array<Object>} - Returns the list of product objects.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-14  
* Author: Kerzania  
*/
function getProducts() {
    return PRODUCTS;
}

/*  
* DOCU: Adds a product to the shopping cart. Requires user authentication.
* If user is not logged in, prompts them to log in or sign up first.
*  
* @param {none} - This function does not accept any parameter.
* @returns {void} - This function does not return a value.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-15  
* Author: Errol
* Last Updated By: Allan Banzuela
*/
function addToCart(productId) {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get("user");

    if (!userName) {
        showNotification(
            "Login Required",
            "Please log in or sign up to add items to your cart.",
            "info",
            function () {
                if (typeof window.showLoginModal === "function") {
                    window.showLoginModal(new Event('click'));
                }
            },
            {
                confirmText: "OK",
                showCancel: true,
                cancelText: "Not now"
            }
        );
        return;
    }

    const product = findProductById(productId);

    if (!product) {
        showNotification("Error", "Product not found!", "error");
        return;
    }

    const quantity = 1;

    let cart = getCartFromStorage();

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    setCartToStorage(cart);

    if (typeof updateCartCountBadge === "function") {
        updateCartCountBadge();
    }

    showNotification("Drink Added!", `${product.name} (x${quantity}) has been added to cart.`);
}

/*  
* DOCU: Switches the dashboard display to a specific page number.
* It calculates the total pages based on PAGE_SIZE, validates the requested page,
* slices the correct products for that page, updates the product count text,
* then re-renders both the products and pagination controls.
*  
* @param {number} page - The page number to display.
* @returns {void} - This function does not return a value.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-14  
* Author: Kerzania  
*/
function goToPage(page, productList) {

    // Use provided list or default to all products
    const products = productList || getProducts();
    const totalPages = Math.ceil(products.length / PAGE_SIZE);

    //keep page within valid range
    if (page < 1) {
        page = 1;
    }
    if (page > totalPages) {
        page = totalPages;
    }

    const startIndex = (page - 1) * PAGE_SIZE;
    const pageProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

    if (productLength) {
        productLength.innerText = `(${products.length})`;
    }

    renderProducts(pageProducts);
    renderPagination(totalPages, page, products);
}


/*  
* DOCU: Builds and displays the pagination controls for the dashboard.
* It creates a previous button, a button for each page number, and a next button.
* It also handles disabling previous/next when the active page is at the boundary.
*  
* @param {number} totalPages - The total number of pages available.
* @param {number} activePage - The currently selected page number.
* @returns {void} - This function does not return a value.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-14  
* Author: Kerzania  
*/
function renderPagination(totalPages, activePage, productList) {

    paginationContainer.innerHTML = "";

    // Creating the html element for the previous button
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";

    prevBtn.classList.add("page-btn");
    prevBtn.innerText = "<";
    prevBtn.disabled = activePage === 1;

    prevBtn.addEventListener("click", function () {
        goToPage(activePage - 1, productList);
    });

    paginationContainer.appendChild(prevBtn);

    // Creating the html elements for each page number button
    for (let page = 1; page <= totalPages; page++) {

        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("page-btn");
        btn.innerText = page;

        if (page === activePage) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", function () {
            goToPage(page, productList);
        });

        paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.classList.add("page-btn");
    nextBtn.innerText = ">";
    nextBtn.disabled = activePage === totalPages;

    nextBtn.addEventListener("click", function () {
        goToPage(activePage + 1, productList);
    });

    paginationContainer.appendChild(nextBtn);
}
