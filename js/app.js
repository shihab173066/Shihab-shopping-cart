const products = [
  {
    id: 1,
    name: "Product A",
    description: "This is a description of Product A.",
    price: 50.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/200px-Red_Apple.jpg",
  },
  {
    id: 2,
    name: "Product B",
    description: "This is a description of Product B.",
    price: 30.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/200px-Banana-Single.jpg",
  },
  {
    id: 3,
    name: "Product C",
    description: "This is a description of Product C.",
    price: 20.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Cherry_Stella444.jpg/200px-Cherry_Stella444.jpg",
  },
  {
    id: 4,
    name: "Product D",
    description: "This is a description of Product D.",
    price: 70.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kyoho-grape.jpg/200px-Kyoho-grape.jpg",
  },
  {
    id: 5,
    name: "Product E",
    description: "This is a description of Product E.",
    price: 40.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/200px-Hapus_Mango.jpg",
  },
  {
    id: 6,
    name: "Product F",
    description: "This is a description of Product F.",
    price: 100.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/200px-Orange-Fruit-Pieces.jpg",
  },
  {
    id: 7,
    name: "Product G",
    description: "This is a description of Product G.",
    price: 25.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/200px-Pineapple_and_cross_section.jpg",
  },
  {
    id: 8,
    name: "Product H",
    description: "This is a description of Product H.",
    price: 85.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/200px-PerfectStrawberry.jpg",
  },
  {
    id: 9,
    name: "Product I",
    description: "This is a description of Product I.",
    price: 60.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/200px-Patates.jpg",
  },
  {
    id: 10,
    name: "Product J",
    description: "This is a description of Product J.",
    price: 90.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kiwi_aka.jpg/200px-Kiwi_aka.jpg",
  },
];

const cart = { items: [], total: 0, discount: 0 };

// Load products into the UI
function loadProducts() {
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col", "product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <p>$${product.price.toFixed(2)}</p>
      <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productCard);
  });
}

// Add item to the cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.items.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// Apply Coupon Code
function applyCoupon() {
  const couponCode = document.getElementById("coupon-code").value.trim();
  if (couponCode === "ostad10") {
    cart.discount = 0.1; // 10% discount
    alert("Coupon applied! You get a 10% discount.");
  } 
  else if (couponCode === "ostad5") {
    cart.discount = 0.05; // 5% discount
    alert("Coupon applied! You get a 5% discount.");
  } 
  else {
    cart.discount = 0;
    alert("Invalid coupon code.");
  }
  updateCart();
}

// Update the cart UI and total
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  cart.total = 0;

  cart.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    cart.total += itemTotal;

    const li = document.createElement("li");
    li.classList.add("d-flex", "justify-content-between");
    li.innerHTML = `
      ${item.name} (x${item.quantity})
      <div>
        <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
        <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      $${itemTotal.toFixed(2)}
    `;
    cartItems.appendChild(li);
  });

  const discountAmount = cart.total * cart.discount;
  cartCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = (cart.total - discountAmount).toFixed(2);
}

function updateQuantity(itemId, delta) {
  const item = cart.items.find((item) => item.id === itemId);

  if (item) {
    item.quantity += delta;

    // Remove the item if the quantity becomes 0 or less
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((item) => item.id !== itemId);
    }

    updateCart(); // Refresh the cart display
  } else {
    console.error(`Item with ID ${itemId} not found in the cart.`);
  }
}

// Display checkout summary in a modal
function checkout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotalItems = document.getElementById("checkout-total-items");
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutDiscount = document.getElementById("checkout-discount");
  const checkoutTotalCost = document.getElementById("checkout-total-cost");

  checkoutItems.innerHTML = "";
  let totalItems = 0;
  let subtotal = 0;

  cart.items.forEach((item) => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between");
    li.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    checkoutItems.appendChild(li);
  });

  const discountAmount = subtotal * cart.discount;
  const totalCost = subtotal - discountAmount;

  checkoutTotalItems.textContent = totalItems;
  checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  checkoutDiscount.textContent = `$${discountAmount.toFixed(2)}`;
  checkoutTotalCost.textContent = `$${totalCost.toFixed(2)}`;

  const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
  checkoutModal.show();
}

// Place order
document.getElementById("place-order").addEventListener("click", () => {
  alert("Order placed successfully!");
  cart.items = [];
  cart.discount = 0;
  updateCart();
  const checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
  checkoutModal.hide();
});

// Event listeners
document.getElementById("apply-coupon").addEventListener("click", applyCoupon);
document.getElementById("clear-cart").addEventListener("click", () => {
  cart.items = [];
  cart.discount = 0;
  updateCart();
});
document.getElementById("checkout").addEventListener("click", checkout);

// Load products on page load
loadProducts();