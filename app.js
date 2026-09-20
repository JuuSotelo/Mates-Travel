const initialProducts = [
  {
    id: 1,
    name: "Mate Imperial Calabaza",
    category: "mate imperial",
    price: 28900,
    cost: 15800,
    stock: 14,
    sold: 6,
    description: "Versión en calabaza natural con terminación artesanal y formato clásico de uso diario.",
    tone: "#5d6242",
    label: "Calabaza",
  },
  {
    id: 2,
    name: "Mate Imperial Algarrobo",
    category: "mate imperial",
    price: 45900,
    cost: 28200,
    stock: 11,
    sold: 4,
    description: "Cuerpo de algarrobo con veta marcada y pulido suave para una línea más sobria.",
    tone: "#7b6047",
    label: "Algarrobo",
  },
  {
    id: 3,
    name: "Mate Camionero de Acero",
    category: "mate camionero",
    price: 12900,
    cost: 5100,
    stock: 31,
    sold: 9,
    description: "Acero inoxidable de alta resistencia, ideal para uso intensivo y viaje.",
    tone: "#85715c",
    label: "Acero inoxidable",
  },
  {
    id: 4,
    name: "Mate Porito de Calabaza",
    category: "mate porito de calabaza",
    price: 38900,
    cost: 22000,
    stock: 18,
    sold: 6,
    description: "Porito de calabaza con boca bien trabajada y terminación rústica.",
    tone: "#6a5a3d",
    label: "Calabaza",
  },
  {
    id: 5,
    name: "Bombilla Pico de Loro",
    category: "bombilla pico de loro",
    price: 57900,
    cost: 34700,
    stock: 7,
    sold: 3,
    description: "Bombilla de pico largo y filtro fino para mate clásico y cebada pareja.",
    tone: "#7f6946",
    label: "Bombilla",
  },
  {
    id: 6,
    name: "Bombilla Pico de Rey",
    category: "bombilla pico de rey",
    price: 49900,
    cost: 29800,
    stock: 9,
    sold: 2,
    description: "Modelo más robusto con remate fuerte y presencia más solemne.",
    tone: "#6c553c",
    label: "Bombilla",
  },
  {
    id: 7,
    name: "Bombilla Pico de Loro Cincelado",
    category: "bombilla pico de loro cincelado",
    price: 52900,
    cost: 31200,
    stock: 5,
    sold: 1,
    description: "Bombilla trabajada a mano con detalle cincelado y terminación fina.",
    tone: "#4d5a42",
    label: "Bombilla",
  },
  {
    id: 8,
    name: "Canasta Eco Cuero",
    category: "canasta eco cuero",
    price: 49900,
    cost: 29800,
    stock: 9,
    sold: 2,
    description: "Canasta en eco cuero con costuras vistas y compartimentos prácticos para viaje.",
    tone: "#6c553c",
    label: "Eco cuero",
  },
];

const state = {
  products: [...initialProducts],
  search: "",
  category: "all",
  openFamily: "",
  categoryBrowserOpen: false,
  authenticated: false,
  adminView: "catalogo",
  selectedProductId: null,
  editingId: null,
};

const catalogGrid = document.getElementById("catalogGrid");
const searchInput = document.getElementById("searchInput");
const categoryBrowser = document.getElementById("categoryBrowser");
const featuredCount = document.getElementById("featuredCount");
const stockList = document.getElementById("stockList");
const productForm = document.getElementById("productForm");
const productCardTemplate = document.getElementById("productCardTemplate");
const productModal = document.getElementById("productModal");
const modalVisual = document.getElementById("modalVisual");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminLoginModal = document.getElementById("adminLoginModal");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPanelModal = document.getElementById("adminPanelModal");
const adminTabButtons = document.querySelectorAll(".admin-tab");
const adminPanels = document.querySelectorAll(".admin-view");
const accRevenue = document.getElementById("accRevenue");
const accCosts = document.getElementById("accCosts");
const accProfit = document.getElementById("accProfit");
const existingProductSelect = document.getElementById("existingProductSelect");

const categoryFamilies = [
  { family: "mate imperial", variants: ["calabaza", "algarrobo", "acero inoxidable", "de alpaca", "de acero"] },
  { family: "mate camionero", variants: ["algarrobo", "calabaza de acero"] },
  { family: "mate porito de calabaza", variants: ["porito de calabaza"] },
  { family: "bombillas", variants: ["pico de loro", "pico de rey", "pico de loro cincelado"] },
  { family: "canastas", variants: ["eco cuero"] },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currency.format(value);
}

function visibleProducts() {
  return state.products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category} ${product.description}`
      .toLowerCase()
      .includes(state.search.toLowerCase());
    const productText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesCategory =
      state.category === "all" ||
      productText.includes(state.category) ||
      (state.category === "bombillas" && productText.includes("bombilla")) ||
      (state.category === "canastas" && productText.includes("canasta")) ||
      (state.category === "mate imperial" && productText.includes("imperial")) ||
      (state.category === "mate camionero" && productText.includes("camionero")) ||
      (state.category === "mate porito de calabaza" && productText.includes("porito"));
    return matchesSearch && matchesCategory;
  });
}

function getProductById(id) {
  return state.products.find((product) => product.id === id);
}

function getFormProductId() {
  const rawValue = productForm.elements.id.value;
  return rawValue ? Number(rawValue) : null;
}

function renderCategoryBrowser() {
  categoryBrowser.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = `category-browser-shell ${state.categoryBrowserOpen ? "open" : ""}`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "category-browser-toggle";
  toggle.innerHTML = '<span>Categorías</span><span class="category-chevron">▾</span>';
  toggle.addEventListener("click", () => {
    state.categoryBrowserOpen = !state.categoryBrowserOpen;
    if (!state.categoryBrowserOpen) {
      state.openFamily = "";
    }
    renderAll();
  });
  wrapper.appendChild(toggle);

  const panel = document.createElement("div");
  panel.className = "category-browser-panel";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = `category-all-btn ${state.category === "all" ? "active" : ""}`;
  allButton.textContent = "Todas";
  allButton.addEventListener("click", () => {
    state.category = "all";
    renderAll();
  });
  panel.appendChild(allButton);

  categoryFamilies.forEach((family) => {
    const familyItem = document.createElement("div");
    familyItem.className = `category-family ${state.openFamily === family.family ? "open" : ""}`;

    const familyBtn = document.createElement("button");
    familyBtn.type = "button";
    familyBtn.className = `category-family-btn ${state.category === family.family ? "active" : ""}`;
    familyBtn.innerHTML = `<span>${family.family}</span><span class="category-chevron">▾</span>`;
    familyBtn.addEventListener("click", () => {
      state.openFamily = state.openFamily === family.family ? "" : family.family;
      state.category = family.family;
      renderAll();
    });

    const variants = document.createElement("div");
    variants.className = "category-variants";

    family.variants.forEach((variant) => {
      const variantBtn = document.createElement("button");
      variantBtn.type = "button";
      variantBtn.className = `category-variant-btn ${state.category === variant ? "active" : ""}`;
      variantBtn.textContent = variant;
      variantBtn.addEventListener("click", () => {
        state.openFamily = family.family;
        state.category = variant;
        renderAll();
      });
      variants.appendChild(variantBtn);
    });

    familyItem.appendChild(familyBtn);
    familyItem.appendChild(variants);
    panel.appendChild(familyItem);
  });

  wrapper.appendChild(panel);
  categoryBrowser.appendChild(wrapper);
}

function updateProductSelect() {
  const selectedValue = existingProductSelect.value;
  existingProductSelect.innerHTML = ['<option value="">Nuevo producto</option>']
    .concat(
      state.products.map((product) => `<option value="${product.id}">${product.name}</option>`),
    )
    .join("");

  if (selectedValue) {
    existingProductSelect.value = selectedValue;
  }
}

function fillForm(product) {
  productForm.elements.id.value = product ? String(product.id) : "";
  existingProductSelect.value = product ? String(product.id) : "";
  productForm.elements.name.value = product?.name || "";
  productForm.elements.family.value = product?.category || "";
  productForm.elements.subtype.value = "";
  productForm.elements.price.value = product ? String(product.price) : "";
  productForm.elements.stock.value = product ? String(product.stock) : "";
  productForm.elements.cost.value = product ? String(product.cost) : "";
  productForm.elements.description.value = product?.description || "";
  state.editingId = product ? product.id : null;
}

function resetForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  existingProductSelect.value = "";
  state.editingId = null;
}

function renderCatalog() {
  const products = visibleProducts();
  featuredCount.textContent = `Mostrando ${products.length} piezas en la categoría seleccionada`;
  catalogGrid.innerHTML = "";

  products.forEach((product) => {
    const card = productCardTemplate.content.firstElementChild.cloneNode(true);
    const productImage = card.querySelector(".product-image");
    const productLabel = card.querySelector(".product-label");
    const productCategory = card.querySelector(".product-category");
    const productStock = card.querySelector(".product-stock");
    const productName = card.querySelector(".product-name");
    const productDescription = card.querySelector(".product-description");
    const productPrice = card.querySelector(".product-price");

    card.dataset.productId = String(product.id);
    if (productImage) productImage.style.background = `linear-gradient(135deg, ${product.tone}, #1d1a17)`;
    if (productLabel) productLabel.textContent = product.label || "Pieza única";
    if (productCategory) productCategory.textContent = product.category;
    if (productStock) productStock.textContent = `Stock ${product.stock}`;
    if (productName) productName.textContent = product.name;
    if (productDescription) productDescription.textContent = product.description;
    if (productPrice) productPrice.textContent = formatCurrency(product.price);
    catalogGrid.appendChild(card);
  });

  if (products.length === 0) {
    catalogGrid.innerHTML = '<p class="panel">No hay productos que coincidan con la búsqueda.</p>';
  }
}

function renderStock() {
  stockList.innerHTML = "";

  state.products.forEach((product) => {
    const row = document.createElement("div");
    row.className = "stock-row";
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <small>${product.category} · ${formatCurrency(product.price)}</small>
      </div>
      <div>
        <strong>${product.stock}</strong>
        <small>unidades</small>
      </div>
      <div class="stock-edit-actions">
        <button type="button" data-action="edit" data-id="${product.id}">Editar</button>
        <button type="button" data-action="minus" data-id="${product.id}">-</button>
        <button type="button" data-action="plus" data-id="${product.id}">+</button>
      </div>
    `;
    stockList.appendChild(row);
  });
}

function renderAccounting() {
  const revenue = state.products.reduce((sum, product) => sum + product.price * product.sold, 0);
  const costs = state.products.reduce((sum, product) => sum + product.cost * product.sold, 0);
  accRevenue.textContent = formatCurrency(revenue);
  accCosts.textContent = formatCurrency(costs);
  accProfit.textContent = formatCurrency(revenue - costs);
}

function applyAdminView(view) {
  state.adminView = view;
  adminTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.adminView === view);
  });

  adminPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.adminPanel !== view);
    panel.classList.toggle("active", panel.dataset.adminPanel === view);
  });
}

function renderAdmin() {
  updateProductSelect();
  renderStock();
  renderAccounting();
  applyAdminView(state.adminView);
  adminLoginBtn.classList.toggle("hidden", state.authenticated);
  adminLogoutBtn.classList.toggle("hidden", !state.authenticated);
}

function renderAll() {
  renderCategoryBrowser();
  renderCatalog();
  renderAdmin();
}

function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  state.selectedProductId = productId;
  modalVisual.style.background = `linear-gradient(135deg, ${product.tone}, #1d1a17)`;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatCurrency(product.price);
  modalStock.textContent = `${product.stock} unidades`;
  productModal.classList.remove("hidden");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  state.selectedProductId = null;
  productModal.classList.add("hidden");
  productModal.setAttribute("aria-hidden", "true");
}

function openLoginModal() {
  adminLoginModal.classList.remove("hidden");
  adminLoginModal.setAttribute("aria-hidden", "false");
}

function closeLoginModal() {
  adminLoginModal.classList.add("hidden");
  adminLoginModal.setAttribute("aria-hidden", "true");
}

function setAuthenticated(authenticated) {
  state.authenticated = authenticated;
  renderAdmin();
}

function openAdminPanel() {
  adminPanelModal.classList.remove("hidden");
  adminPanelModal.setAttribute("aria-hidden", "false");
  renderAdmin();
}

function closeAdminPanel() {
  adminPanelModal.classList.add("hidden");
  adminPanelModal.setAttribute("aria-hidden", "true");
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderCatalog();
});

catalogGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".product-card");
  const productId = Number(card?.dataset.productId);
  if (button.dataset.action === "details") {
    openProductModal(productId);
  }
});

productModal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.action === "close-modal") {
    closeProductModal();
  }
});

modalCloseBtn.addEventListener("click", closeProductModal);

adminLoginBtn.addEventListener("click", openLoginModal);
adminLogoutBtn.addEventListener("click", () => setAuthenticated(false));

adminLoginModal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.action === "close-login") {
    closeLoginModal();
  }
});

adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (username === "admin" && password === "admin123") {
    closeLoginModal();
    setAuthenticated(true);
    adminLoginForm.reset();
    applyAdminView("catalogo");
    openAdminPanel();
    return;
  }

  window.alert("Usuario o contraseña incorrectos.");
});

adminTabButtons.forEach((button) => {
  button.addEventListener("click", () => applyAdminView(button.dataset.adminView));
});

adminPanelModal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.action === "close-admin") {
    closeAdminPanel();
  }
});

stockList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const product = getProductById(productId);
  if (!product) return;

  if (button.dataset.action === "edit") {
    fillForm(product);
  }

  if (button.dataset.action === "plus") {
    product.stock += 1;
  }

  if (button.dataset.action === "minus" && product.stock > 0) {
    product.stock -= 1;
  }

  renderAll();
});

existingProductSelect.addEventListener("change", () => {
  const productId = existingProductSelect.value ? Number(existingProductSelect.value) : null;
  if (!productId) {
    resetForm();
    return;
  }

  const product = getProductById(productId);
  if (product) {
    fillForm(product);
  }
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(productForm);
  const existingId = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const family = String(formData.get("family") || "").trim().toLowerCase();
  const subtype = String(formData.get("subtype") || "").trim().toLowerCase();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const cost = Number(formData.get("cost"));
  const description = String(formData.get("description") || "").trim();

  if (!name || !family || Number.isNaN(price) || Number.isNaN(stock) || Number.isNaN(cost) || !description) {
    return;
  }

  const category = subtype ? `${family} ${subtype}`.trim() : family;

  if (existingId) {
    const product = getProductById(Number(existingId));
    if (product) {
      product.name = name;
      product.category = category;
      product.price = price;
      product.stock = stock;
      product.cost = cost;
      product.description = description;
    }
  } else {
    state.products.unshift({
      id: Date.now(),
      name,
      category,
      price,
      cost,
      stock,
      sold: 0,
      description,
      tone: "#a15c38",
    });
  }

  resetForm();
  renderAll();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!productModal.classList.contains("hidden")) {
      closeProductModal();
    }
    if (!adminLoginModal.classList.contains("hidden")) {
      closeLoginModal();
    }
    if (!adminPanelModal.classList.contains("hidden")) {
      closeAdminPanel();
    }
  }
});

renderAll();
