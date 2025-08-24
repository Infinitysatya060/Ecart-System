function updateCartCount() {
  let totalItems = 0;
  document.querySelectorAll(".items .add").forEach((addBox) => {
    if (addBox.style.display !== "none") {
      const qty = parseInt(addBox.querySelector(".text").textContent);
      totalItems += qty;
    }
  });

  document.querySelector(".My-cart .head h2").textContent = `Your Cart (${totalItems})`;

  // toggle empty cart image/message
  const cart = document.querySelector(".cart-items");
  const image = document.querySelector(".image");
  if (cart.querySelectorAll(".innerchild").length === 0) {
    image.style.display = "block";
  } else {
    image.style.display = "none";
  }

  updateCartTotal();
}

// === Handle each product item ===
document.querySelectorAll(".items").forEach((item) => {
  const addBtn = item.querySelector(".btn");
  const counterBox = item.querySelector(".add");
  const decBtn = item.querySelector(".decreament");
  const incBtn = item.querySelector(".increament");
  const text = item.querySelector(".text");
  const name = item.querySelector(".product-name");
  const productPrice = item.querySelector(".product-price");

  counterBox.style.display = "none"; // hide initially

  addBtn.addEventListener("click", () => {
    addBtn.style.display = "none";
    counterBox.style.display = "flex";
    text.textContent = 1;
    addToCart(name.innerText, text.textContent, productPrice.innerText, item);
    updateCartCount();
  });

  incBtn.addEventListener("click", () => {
    text.textContent = parseInt(text.textContent) + 1;
    addToCart(name.innerText, text.textContent, productPrice.innerText, item);
    updateCartCount();
  });

  decBtn.addEventListener("click", () => {
    let count = parseInt(text.textContent);
    if (count > 1) {
      text.textContent = count - 1;
      addToCart(name.innerText, text.textContent, productPrice.innerText, item);
    } else {
      text.textContent = 0;
      counterBox.style.display = "none";
      addBtn.style.display = "block";
      removeFromCart(name.innerText);
    }
    updateCartCount();
  });
});

const cart = document.querySelector(".cart-items");

// === Add or update items in cart ===
function addToCart(name, count, priceText, productItem) {
  let existingItem = [...cart.querySelectorAll(".innerchild")].find(
    (child) => child.querySelector(".show").innerText === name
  );

  let unitPrice = parseFloat(priceText.replace(/[^0-9.]/g, ""));
  let total = parseInt(count) * unitPrice;

  if (existingItem) {
    existingItem.querySelector(".child3 p:nth-child(1)").innerText = `${count}x`;
    existingItem.querySelector(".child3 p:nth-child(3)").innerText = `$${total.toFixed(2)}`;
  } else {
    let child = document.createElement("div");
    child.classList.add("innerchild");

    let title = document.createElement("p");
    title.classList.add("show");
    title.innerText = name;

    let child3 = document.createElement("div");
    child3.classList.add("child3");

    let qty = document.createElement("p");
    qty.innerText = `${count}x`;

    let unit = document.createElement("p");
    unit.innerText = priceText;

    let totalEl = document.createElement("p");
    totalEl.innerText = `$${total.toFixed(2)}`;

    let remove = document.createElement("img");
    remove.src = "images/icon-remove-item.svg";
    remove.classList.add("rmv");

    remove.addEventListener("click", () => {
      child.remove();
      const counterBox = productItem.querySelector(".add");
      const addBtn = productItem.querySelector(".btn");
      const text = productItem.querySelector(".text");
      text.textContent = 0;
      counterBox.style.display = "none";
      addBtn.style.display = "block";
      updateCartCount();
    });

    child3.appendChild(qty);
    child3.appendChild(unit);
    child3.appendChild(totalEl);
    child3.appendChild(remove);

    child.appendChild(title);
    child.appendChild(child3);
    cart.appendChild(child);
  }
}

// === Remove from cart ===
function removeFromCart(name) {
  let item = [...cart.querySelectorAll(".innerchild")].find(
    (child) => child.querySelector(".show").innerText === name
  );
  if (item) item.remove();
}

// === Update cart subtotal + confirm button ===
function updateCartTotal() {
  let total = 0;
  cart.querySelectorAll(".innerchild").forEach((child) => {
    let price = child.querySelector(".child3 p:nth-child(3)").innerText;
    total += parseFloat(price.replace(/[^0-9.]/g, ""));
  });

  // remove old total & button if exist
  let oldTotal = document.querySelector(".cart-total");
  if (oldTotal) oldTotal.remove();

  if (total > 0) {
    let totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");

    let orderText = document.createElement("h3");
    orderText.innerText = `Order Total: $${total.toFixed(2)}`;

    let confirmBtn = document.createElement("button");
    confirmBtn.innerText = "Confirm Order";
    confirmBtn.classList.add("confirm-btn");

    confirmBtn.addEventListener("click", () => {
      alert(`✅ Your order of $${total.toFixed(2)} has been confirmed!`);
      // Optional: clear cart after confirm
      cart.innerHTML = "";
      document.querySelectorAll(".items").forEach((item) => {
        item.querySelector(".btn").style.display = "block";
        item.querySelector(".add").style.display = "none";
        item.querySelector(".text").textContent = 0;
      });
      updateCartCount();
    });

    totalDiv.appendChild(orderText);
    totalDiv.appendChild(confirmBtn);
    cart.appendChild(totalDiv);
  }
}
