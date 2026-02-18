/* CONSTANTS */
const mainImage = document.getElementById("mainImage");
const productName = document.getElementById("productName");
const productMeta = document.getElementById("productMeta");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const totalPrice = document.getElementById("totalPrice");

// Event Listeners
document.getElementById("avatar").addEventListener("click", toggleDropdown);
window.addEventListener("click", closeDropdown);

/*  
* DOCU: Extracts the product ID from the current page URL query string.
* It looks for the "id" parameter and converts its value into a number.
*  
* @param {none} - This function does not accept any parameter.
* @returns {number|null} - Returns the product ID as a number if found; otherwise returns null.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-14  
* Author: Kerzania  
*/
function getProductIdFromURL() {
  const query = window.location.search; //output sample: "?id=2"

  if (!query) return null;

  const queryParts = query.substring(1).split("&");
  for (let i = 0; i < queryParts.length; i++) {
    const pair = queryParts[i].split("=");
    const key = pair[0];
    const value = pair[1];

    if (key === "id") {
      return Number(value);
    }
  }

  return null;
}

/*  
* DOCU: Displays the selected product details on the product view page.
* It retrieves the product ID from the URL, finds the matching product
* from the PRODUCTS array, and updates the DOM elements accordingly.
*  
* @param {none} - This function does not accept any parameter.
* @returns {void} - This function does not return a value.
* @throws {none} - This function does not explicitly throw errors.
*
* Last Updated: 2026-02-14  
* Author: Kerzania  
*/
function displaySelectedProduct() {
  const productId = getProductIdFromURL();

  const product = findProductById(productId);

  if (!product) {
    productName.innerText = "Product not found";
    return;
  }

  mainImage.src = product.image;
  mainImage.alt = product.name;
  mainImage.classList.add("main-image")

  productName.innerText = product.name;
  productMeta.innerText = `${product.stars} stars • ${product.ratings} Ratings`;
  productPrice.innerText = Number(product.price).toFixed(2);
  totalPrice.innerText = Number(product.price).toFixed(2);

  if (productDescription) {
    productDescription.innerText = product.description || "";
  }
}

displaySelectedProduct();

/*
 * DOCU: Toggles the visibility of the user dropdown menu when the avatar is clicked.
 * @param {MouseEvent} event - The click event triggered by the user.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *
 * Last Updated: 2026-02-11
 * Author: Jheanne A. Salan
 * Last Updated By: Jheanne A. Salan
 */
function toggleDropdown(event) {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("show");
  event.stopPropagation(); // Prevents event from bubbling to window
}

/*
 * DOCU: Closes the dropdown menu when the user clicks outside of it.
 * @param {MouseEvent} event - The click event triggered anywhere on the window.
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *
 * Last Updated: 2026-02-11
 * Author: Jheanne A. Salan
 * Last Updated By: Jheanne A. Salan
 */
function closeDropdown(event) {
  const avatar = document.getElementById("avatar");
  const dropdown = document.getElementById("dropdownMenu");

  if (!avatar.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
}

/*
 * DOCU: Updates the quantity input when the user clicks the plus/minus buttons.
 * @param {number} step - The value to add to the current quantity (ex: -1 or 1).
 * @returns {void} - Does not return a value.
 * @throws {None} - No exceptions are thrown.
 *
 * Last Updated: 2026-02-11
 * Author: Jheanne A. Salan
 * Last Updated By: Jheanne A. Salan
 */
function changeQty(step) {
  const qtyInput = document.getElementById("qty");
  const current = parseInt(qtyInput.value, 10) || 1;
  const next = Math.max(1, current + step);
  qtyInput.value = next;
}
