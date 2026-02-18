/* SINGLE SOURCE OF TRUTH */
const PRODUCTS = [
    {
        id: 1,
        name: "Latte",
        category: "classic",
        price: 4.50,
        image: "assets/products/product-images/latte.png",
        description: "Smooth espresso meets creamy steamed milk."
    },
    {
        id: 2,
        name: "Crafted Press",
        category: "classic",
        price: 4.00,
        image: "assets/products/product-images/crafted-press.png",
        description: "Bold, slow-steeped coffee with rich flavor."
    },
    {
        id: 3,
        name: "Mocha",
        category: "classic",
        price: 5.00,
        image: "assets/products/product-images/mocha.png",
        description: "Espresso and chocolate in perfect harmony."
    },
    {
        id: 4,
        name: "Americano",
        category: "classic",
        price: 3.75,
        image: "assets/products/product-images/americano.png",
        description: "Pure espresso with hot water. Simple and strong."
    },
    {
        id: 5,
        name: "Cappuccino",
        category: "classic",
        price: 4.25,
        image: "assets/products/product-images/cappuccino.png",
        description: "Bold espresso topped with velvety foam."
    },
    {
        id: 6,
        name: "Malted Mocha",
        category: "signature",
        price: 5.75,
        image: "assets/products/product-images/malted-mocha.png",
        description: "Nostalgic malt meets rich chocolate and espresso."
    },
    {
        id: 7,
        name: "Mint Condition Mocha",
        category: "signature",
        price: 5.75,
        image: "assets/products/product-images/mint-condition-mocha.png",
        description: "Cool mint and dark chocolate create pure bliss."
    },
    {
        id: 8,
        name: "Berry White Mocha",
        category: "signature",
        price: 5.75,
        image: "assets/products/product-images/berry-white-mocha.png",
        description: "Sweet berries and white chocolate magic."
    },
    {
        id: 9,
        name: "Honey Lavender Latte",
        category: "signature",
        price: 5.50,
        image: "assets/products/product-images/honey-lavender-latte.png",
        description: "Floral lavender sweetened with golden honey."
    },
    {
        id: 10,
        name: "Frozen Cookies & Cream",
        category: "signature",
        price: 6.25,
        image: "assets/products/product-images/frozen-cookies-&-cream.png",
        description: "Creamy blended treat loaded with cookie pieces."
    },
    {
        id: 11,
        name: "Honey Lavender Espresso Shaker",
        category: "espresso-shakers",
        price: 5.50,
        image: "assets/products/product-images/honey-lavender-espresso-shaker.png",
        description: "Iced espresso shaken with honey and lavender."
    },
    {
        id: 12,
        name: "Caramel Espresso Shaker",
        category: "espresso-shakers",
        price: 5.25,
        image: "assets/products/product-images/caramel-espresso-shaker.png",
        description: "Buttery caramel meets cold shaken espresso."
    },
    {
        id: 13,
        name: "Vanilla Espresso Shaker",
        category: "espresso-shakers",
        price: 5.25,
        image: "assets/products/product-images/vanilla-espresso-shaker.png",
        description: "Classic vanilla blended with iced espresso."
    },
    {
        id: 14,
        name: "Malted Mocha Espresso Shaker",
        category: "espresso-shakers",
        price: 5.75,
        image: "assets/products/product-images/malted-mocha-espresso-shaker.png",
        description: "Malt and chocolate shaken ice cold with espresso."
    },
    {
        id: 15,
        name: "White Chocolate Espresso Shaker",
        category: "espresso-shakers",
        price: 5.50,
        image: "assets/products/product-images/white-chocolate-espresso-shaker.png",
        description: "Sweet white chocolate in a refreshing shake."
    },
    {
        id: 16,
        name: "Blue Raspberry Energy Drink",
        category: "energy-drinks",
        price: 4.75,
        image: "assets/products/product-images/blue-raspberry-energy-drink.png",
        description: "Bright blue burst of raspberry energy."
    },
    {
        id: 17,
        name: "Lavender Energy Drink",
        category: "energy-drinks",
        price: 4.75,
        image: "assets/products/product-images/lavender-energy-drink.png",
        description: "Floral energy boost with a hint of calm."
    },
    {
        id: 18,
        name: "Peach Mango Energy Drink",
        category: "energy-drinks",
        price: 4.75,
        image: "assets/products/product-images/peach-mango-energy-drink.png",
        description: "Tropical vibes with a powerful kick."
    },
    {
        id: 19,
        name: "Strawberry Pineapple Energy Drink",
        category: "energy-drinks",
        price: 4.75,
        image: "assets/products/product-images/strawberry-pineapple-energy-drink.png",
        description: "Sweet strawberry meets tangy pineapple power."
    },
    {
        id: 20,
        name: "Sugar Free Salted Watermelon Energy Drink",
        category: "energy-drinks",
        price: 4.75,
        image: "assets/products/product-images/sugar-free-salted-watermelon-energy-drink.png",
        description: "Zero sugar, all flavor. Salty-sweet watermelon rush."
    },
    {
        id: 21,
        name: "Frozen Matcha Tea with Bubbles",
        category: "tea-and-more",
        price: 5.75,
        image: "assets/products/product-images/frozen-matcha-tea-with-bubbles.png",
        description: "Icy matcha blended smooth with chewy bubbles."
    },
    {
        id: 22,
        name: "Raspberry Green Tea with Bubbles",
        category: "tea-and-more",
        price: 4.50,
        image: "assets/products/product-images/raspberry-green-tea-with-bubbles.png",
        description: "Sweet raspberry tea with fun popping bubbles."
    },
    {
        id: 23,
        name: "Classic Black Iced Tea with Lemonade",
        category: "tea-and-more",
        price: 4.00,
        image: "assets/products/product-images/classic-black-iced-tea-with-lemonade.png",
        description: "Half tea, half lemonade. Pure refreshment."
    },
    {
        id: 24,
        name: "Tropical Green Iced Tea with Lemonade",
        category: "tea-and-more",
        price: 4.25,
        image: "assets/products/product-images/tropical-green-iced-tea-with-lemonade.png",
        description: "Green tea meets tropical citrus and lemonade."
    },
    {
        id: 25,
        name: "Matcha Vanilla Tea Latte",
        category: "tea-and-more",
        price: 5.25,
        image: "assets/products/product-images/matcha-vanilla-tea-latte.png",
        description: "Earthy matcha softened with sweet vanilla cream."
    },
    {
        id: 26,
        name: "Hot Cinnamon Tea",
        category: "tea-and-more",
        price: 3.50,
        image: "assets/products/product-images/hot-cinnamon-tea.png",
        description: "Warm, spicy cinnamon in every sip."
    },
    {
        id: 27,
        name: "Earl Grey Tea",
        category: "tea-and-more",
        price: 3.25,
        image: "assets/products/product-images/earl-grey-tea.png",
        description: "Classic bergamot black tea. Timeless and elegant."
    },
    {
        id: 28,
        name: "Chamomile Mint Tea",
        category: "tea-and-more",
        price: 3.50,
        image: "assets/products/product-images/chamomile-mint-tea.png",
        description: "Gentle chamomile with a cool mint finish."
    },
    {
        id: 29,
        name: "Earl Grey Tea Latte",
        category: "tea-and-more",
        price: 4.50,
        image: "assets/products/product-images/earl-grey-tea-latte.png",
        description: "Creamy twist on the classic Earl Grey."
    },
    {
        id: 30,
        name: "Classic Chai Latte",
        category: "tea-and-more",
        price: 4.75,
        image: "assets/products/product-images/classic-chai-latte.png",
        description: "Warm spices and black tea with steamed milk."
    }
];


/* HELPERS */
function findProductById(productId) {

    for (let i = 0; i < PRODUCTS.length; i++) {

        if (PRODUCTS[i].id === productId) {
            return PRODUCTS[i];
        }

    }

    return null;
}

function generateStars(productId) {
    return (productId % 5) + 1;
}

function generateRatings(productId) {
    return ((productId * 73) % 300) + 1;
}

PRODUCTS.forEach(function (product) {
    if (typeof product.stars !== "number") {
        product.stars = generateStars(product.id);
    }

    if (typeof product.ratings !== "number") {
        product.ratings = generateRatings(product.id);
    }
});