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
const productForm = document.getElementById("productForm");
const productCardTemplate = document.getElementById("productCardTemplate");
const productModal = document.getElementById("productModal");
const modalVisual = document.getElementById("modalVisual");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminEditBtn = document.getElementById("adminEditBtn");
const adminLoginModal = document.getElementById("adminLoginModal");
const adminLoginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");
const adminPanelModal = document.getElementById("adminPanelModal");
const adminTabButtons = document.querySelectorAll(".admin-tab");
const adminPanels = document.querySelectorAll(".admin-view");
const accSheetBody = document.getElementById("accSheetBody");
const accSheetFoot = document.getElementById("accSheetFoot");
const accSheetNote = document.getElementById("accSheetNote");
const accNewProductBtn = document.getElementById("accNewProductBtn");
const productsAdminList = document.getElementById("productsAdminList");
const categorySelect = document.getElementById("categorySelect");
const variantSelect = document.getElementById("variantSelect");
const newFamilyField = document.getElementById("newFamilyField");
const newVariantField = document.getElementById("newVariantField");
const imageInput = document.getElementById("imageInput");
const imageDropzone = document.getElementById("imageDropzone");
const imagePreview = document.getElementById("imagePreview");
const imageDropzoneEmpty = document.getElementById("imageDropzoneEmpty");
const imageRemoveBtn = document.getElementById("imageRemoveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let pendingImage = null;

let categoryFamilies = [
  { family: "mate imperial", variants: ["calabaza", "algarrobo", "acero inoxidable", "de alpaca", "de acero"] },
  { family: "mate camionero", variants: ["algarrobo", "calabaza de acero"] },
  { family: "mate porito", variants: ["porito de calabaza"] },
  { family: "bombillas", variants: ["pico de loro", "pico de rey", "pico de loro cincelado"] },
  { family: "canastas", variants: ["eco cuero"] },
];

const STORAGE_KEY = "mates-travel-data";

let dbUsers = [];

function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const maxWord = Math.pow(2, 32);
  let result = "";
  const words = [];
  const asciiBitLength = ascii.length * 8;
  let hash = (sha256.h = sha256.h || []);
  const k = (sha256.k = sha256.k || []);
  let primeCounter = k.length;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while (ascii.length % 64 !== 56) ascii += "\x00";
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;
  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);
    hash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && "products" in parsed ? parsed : null;
  } catch {
    return null;
  }
}

function persistPayload() {
  return {
    products: state.products,
    categoryFamilies,
    users: dbUsers,
  };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistPayload()));
  } catch {
    // Modo incógnito o sin espacio: se ignora el guardado local.
  }
  scheduleRemoteSync();
}

let remoteSyncTimer = null;
function scheduleRemoteSync() {
  if (!remoteDb) return;
  clearTimeout(remoteSyncTimer);
  remoteSyncTimer = setTimeout(() => {
    remoteDb.push(persistPayload()).catch((error) => {
      console.warn("No se guardó en Turso:", error);
    });
  }, 400);
}

function sqlText(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "0";
}

class TursoClient {
  constructor(url, token) {
    this.baseUrl = String(url).replace(/\/+$/, "").replace(/^libsql:\/\//, "https://");
    this.token = token;
  }
  async request(sql) {
    const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        requests: [{ type: "execute", stmt: { sql: String(sql) } }],
      }),
    });
    if (!response.ok) throw new Error(`Turso HTTP ${response.status}`);
    const json = await response.json();
    const first = json && json.results && json.results[0];
    const err = first && first.response && (first.response.error || (first.response.result && first.response.result.error));
    if (first && first.type !== "ok" && err) {
      throw new Error((err.message || err) + " | " + String(sql).slice(0, 80));
    }
    return first ? first.response : null;
  }
  async batch(statements) {
    const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        requests: statements.map((sql) => ({ type: "execute", stmt: { sql: String(sql) } })),
      }),
    });
    if (!response.ok) throw new Error(`Turso HTTP ${response.status}`);
    const json = await response.json();
    const results = json && json.results;
    if (!results) throw new Error("Turso sin resultados");
    for (const item of results) {
      if (item && item.response && item.response.error) {
        throw new Error(item.response.error.message || "Error de Turso");
      }
    }
    return results;
  }
  async ensureSchema() {
    await this.batch([
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT '',
        label TEXT,
        price INTEGER NOT NULL DEFAULT 0,
        cost INTEGER NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        sold INTEGER NOT NULL DEFAULT 0,
        description TEXT NOT NULL DEFAULT '',
        image TEXT,
        tone TEXT NOT NULL DEFAULT '#a15c38'
      )`,
      `CREATE TABLE IF NOT EXISTS category_families (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family TEXT NOT NULL,
        variants TEXT NOT NULL DEFAULT '[]'
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)`,
    ]);
  }
  async pull() {
    await this.ensureSchema();
    const unwrap = (obj) => {
      if (obj && typeof obj === "object") {
        if ("value" in obj) return obj.value;
        if (obj.type === "null") return null;
      }
      return obj;
    };
    const readyRes = await this.request("SELECT value FROM meta WHERE key = 'ready'");
    if (!readyRes || !readyRes.result.rows.length) return null;
    const productsRes = await this.request("SELECT * FROM products ORDER BY id");
    const familiesRes = await this.request("SELECT * FROM category_families ORDER BY id");
    const usersRes = await this.request("SELECT * FROM users ORDER BY id");
    const products = productsRes.result.rows.map((row) => ({
      id: Number(unwrap(row[0])),
      name: String(unwrap(row[1]) ?? ""),
      category: String(unwrap(row[2]) ?? ""),
      label: unwrap(row[3]) === null ? null : String(unwrap(row[3])),
      price: Number(unwrap(row[4]) ?? 0),
      cost: Number(unwrap(row[5]) ?? 0),
      stock: Number(unwrap(row[6]) ?? 0),
      sold: Number(unwrap(row[7]) ?? 0),
      description: String(unwrap(row[8]) ?? ""),
      image: unwrap(row[9]) === null ? null : String(unwrap(row[9])),
      tone: String(unwrap(row[10]) ?? "#a15c38"),
    }));
    const categoryFamilies = familiesRes.result.rows.map((row) => ({
      family: String(unwrap(row[1]) ?? ""),
      variants: JSON.parse(unwrap(row[2]) || "[]"),
    }));
    const users = usersRes.result.rows.map((row) => ({
      username: String(unwrap(row[1]) ?? ""),
      passwordHash: String(unwrap(row[2]) ?? ""),
    }));
    return { products, categoryFamilies, users };
  }
  async findUser(username) {
    await this.ensureSchema();
    const res = await this.request(
      `SELECT username, password_hash FROM users WHERE lower(username) = lower('${String(username).replace(/'/g, "''")}') LIMIT 1`
    );
    const rows = res && res.result && res.result.rows;
    if (!rows || !rows.length) return null;
    const unwrap = (obj) => {
      if (obj && typeof obj === "object") {
        if ("value" in obj) return obj.value;
        if (obj.type === "null") return null;
      }
      return obj;
    };
    return { username: String(unwrap(rows[0][0])), passwordHash: String(unwrap(rows[0][1])) };
  }
  async push(payload) {
    await this.ensureSchema();
    const statements = [];
    statements.push("DELETE FROM products");
    for (const product of payload.products || []) {
      statements.push(
        `INSERT INTO products (id, name, category, label, price, cost, stock, sold, description, image, tone)
         VALUES (${sqlNumber(product.id)}, ${sqlText(product.name)}, ${sqlText(product.category)},
                 ${sqlText(product.label)}, ${sqlNumber(product.price)}, ${sqlNumber(product.cost)},
                 ${sqlNumber(product.stock)}, ${sqlNumber(product.sold)}, ${sqlText(product.description)},
                 ${sqlText(product.image)}, ${sqlText(product.tone || "#a15c38")})`
      );
    }
    statements.push("DELETE FROM category_families");
    for (const family of payload.categoryFamilies || []) {
      statements.push(
        `INSERT INTO category_families (family, variants) VALUES (${sqlText(family.family)}, ${sqlText(JSON.stringify(family.variants || []))})`
      );
    }
    statements.push("DELETE FROM users");
    for (const user of payload.users || []) {
      statements.push(
        `INSERT INTO users (username, password_hash) VALUES (${sqlText(user.username)}, ${sqlText(user.passwordHash)})`
      );
    }
    statements.push(
      "INSERT INTO meta (key, value) VALUES ('ready', '1') ON CONFLICT (key) DO UPDATE SET value = excluded.value"
    );
    await this.batch(statements);
  }
}

class ApiClient {
  constructor() {
    this.healthy = true;
  }
  async call(action, payload) {
    if (!this.healthy) throw new Error("API no disponible");
    let response;
    try {
      response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload === undefined ? { action } : { action, payload }),
      });
    } catch {
      this.healthy = false;
      throw new Error("API no disponible");
    }
    if (!response.ok) {
      if (response.status >= 500) this.healthy = false;
      throw new Error(`API HTTP ${response.status}`);
    }
    const data = await response.json().catch(() => null);
    if (data && data.error) throw new Error(data.error);
    return data ? data.data : null;
  }
  async pull() {
    return await this.call("pull");
  }
  async findUser(username) {
    const data = await this.call("finduser", { username });
    return data || null;
  }
  async push(payload) {
    await this.call("push", payload);
  }
}

const remoteDb = (() => {
  const cfg = (typeof window !== "undefined" && window.MATES_LOCAL_DB) || {};
  if (cfg.url && cfg.token) {
    return new TursoClient(cfg.url, cfg.token);
  }
  if (typeof window !== "undefined" && window.location && /^http/.test(window.location.protocol)) {
    return new ApiClient();
  }
  return null;
})();

const savedData = loadSavedData();
if (savedData) {
  if (Array.isArray(savedData.products) && savedData.products.length) {
    state.products = savedData.products;
  }
  if (Array.isArray(savedData.categoryFamilies)) {
    categoryFamilies = savedData.categoryFamilies;
  }
  if (Array.isArray(savedData.users) && savedData.users.length) {
    dbUsers = savedData.users;
  }
}

try {
  if (sessionStorage.getItem("mates-travel-session") === "1") {
    state.authenticated = true;
  }
} catch {
  // Sin sesión persistente.
}

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currency.format(value);
}

function formatPercent(value) {
  return new Intl.NumberFormat("es-AR", { style: "percent", maximumFractionDigits: 0 }).format(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function categoryPrefixMatches(category, family) {
  const cat = String(category || "").toLowerCase().trim();
  const singular = family.replace(/s$/, "");
  return cat === family || cat.startsWith(`${family} `) || cat === singular || cat.startsWith(`${singular} `);
}

function productMatchesCategory(product, category) {
  if (category === "all") return true;
  const productText = `${product.name} ${product.category} ${product.label || ""} ${product.description}`.toLowerCase();
  const rules = {
    "bombillas": "bombilla",
    "canastas": "canasta",
    "mate imperial": "imperial",
    "mate camionero": "camionero",
    "mate porito": "porito",
  };
  if (rules[category]) {
    return productText.includes(rules[category]);
  }
  if (product.label && product.label.toLowerCase() === category) {
    return true;
  }
  const parts = splitCategory(product.category);
  if (parts.family === category || parts.variant === category) {
    return true;
  }
  return productText.includes(category);
}

function visibleProducts() {
  const search = state.search.trim().toLowerCase();
  const hasSearch = search.length > 0;
  return state.products.filter((product) => {
    const productText = `${product.name} ${product.category} ${product.label || ""} ${product.description}`.toLowerCase();
    if (hasSearch) {
      return productText.includes(search);
    }
    return productMatchesCategory(product, state.category);
  });
}

function capitalize(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const WHATSAPP_NUMBER = "5492604810402";

function openWhatsApp(product) {
  const message = `Hola Mates Travel! Me interesa: ${product.name} (${product.category}).`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function getProductById(id) {
  return state.products.find((product) => product.id === id);
}

function renderCategoryBrowser() {
  categoryBrowser.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = `category-browser-shell ${state.categoryBrowserOpen ? "open" : ""}`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "category-browser-toggle";
  const activeLabel = state.category === "all" ? "Categorías" : `Categorías · ${capitalize(state.category)}`;
  toggle.innerHTML = `<span>${activeLabel}</span><span class="category-chevron">▾</span>`;
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
    state.categoryBrowserOpen = false;
    state.openFamily = "";
    renderAll();
  });
  panel.appendChild(allButton);

  categoryFamilies.forEach((family) => {
    const familyItem = document.createElement("div");
    familyItem.className = `category-family ${state.openFamily === family.family ? "open" : ""}`;

    const familyBtn = document.createElement("button");
    familyBtn.type = "button";
    familyBtn.className = `category-family-btn ${state.category === family.family ? "active" : ""}`;
    familyBtn.innerHTML = `<span>${capitalize(family.family)}</span><span class="category-chevron">▾</span>`;
    familyBtn.addEventListener("click", () => {
      if (family.variants.length === 0) {
        state.category = family.family;
        state.categoryBrowserOpen = false;
        state.openFamily = "";
      } else {
        state.openFamily = state.openFamily === family.family ? "" : family.family;
        state.category = family.family;
      }
      renderAll();
    });

    const variants = document.createElement("div");
    variants.className = "category-variants";
    const variantsInner = document.createElement("div");
    variantsInner.className = "category-variants-inner";

    family.variants.forEach((variant) => {
      const variantBtn = document.createElement("button");
      variantBtn.type = "button";
      variantBtn.className = `category-variant-btn ${state.category === variant ? "active" : ""}`;
      variantBtn.textContent = capitalize(variant);
      variantBtn.addEventListener("click", () => {
        state.category = variant;
        state.categoryBrowserOpen = false;
        state.openFamily = "";
renderAll();

(async function initRemote() {
  if (!remoteDb) return;
  try {
    const remote = await remoteDb.pull();
    if (remote && typeof remote === "object") {
      let mergeUp = false;
      if (Array.isArray(remote.products)) {
        if (remote.products.length) {
          state.products = remote.products;
        } else if (state.products.length) {
          mergeUp = true;
        }
      }
      if (Array.isArray(remote.categoryFamilies)) {
        if (remote.categoryFamilies.length) {
          categoryFamilies = remote.categoryFamilies;
        } else if (categoryFamilies.length) {
          mergeUp = true;
        }
      }
      if (Array.isArray(remote.users)) {
        if (remote.users.length) {
          dbUsers = remote.users;
        } else if (dbUsers.length) {
          mergeUp = true;
        }
      }
      if (mergeUp) scheduleRemoteSync();
    } else {
      scheduleRemoteSync();
    }
  } catch (error) {
    console.warn("No se pudo sincronizar con Turso; se usa el modo local.", error);
  }
  renderAll();
})();
      });
      variantsInner.appendChild(variantBtn);
    });

    familyItem.appendChild(familyBtn);
    variants.appendChild(variantsInner);
    familyItem.appendChild(variants);
    panel.appendChild(familyItem);
  });

  wrapper.appendChild(panel);
  categoryBrowser.appendChild(wrapper);
}

function splitCategory(category) {
  const cat = String(category || "").toLowerCase().trim();
  let family = cat;
  let variant = "";
  const matchFamily = (f) => cat === f.family || cat.startsWith(`${f.family} `);
  const matchSingular = (f) => {
    const singular = f.family.replace(/s$/, "");
    return cat === singular || cat.startsWith(`${singular} `);
  };
  let match = categoryFamilies.find(matchFamily) || categoryFamilies.find(matchSingular);
  if (match) {
    family = match.family;
    variant = cat.slice(family.length).trim();
  }
  return { family, variant };
}

function populateCategorySelect(desiredFamily) {
  const families = categoryFamilies.map((f) => f.family);
  if (desiredFamily && desiredFamily !== "__new__" && !families.includes(desiredFamily)) {
    families.unshift(desiredFamily);
  }
  const options = families
    .map((f) => `<option value="${f}">${capitalize(f)}</option>`)
    .concat(['<option value="__new__">＋ Crear nueva categoría…</option>']);
  categorySelect.innerHTML = options.join("");
  if (desiredFamily && families.includes(desiredFamily)) {
    categorySelect.value = desiredFamily;
  }
}

function syncVariantSelect() {
  const previousValue = variantSelect.value;
  const familyValue = categorySelect.value;

  newFamilyField.classList.toggle("hidden", familyValue !== "__new__");

  if (familyValue === "__new__") {
    variantSelect.disabled = false;
    variantSelect.innerHTML = ['<option value="">Sin subcategoría</option>', '<option value="__new__">＋ Crear subcategoría…</option>'].join("");
    variantSelect.value = "";
    newVariantField.classList.add("hidden");
    return;
  }

  variantSelect.disabled = false;
  const family = categoryFamilies.find((f) => f.family === familyValue);
  const variants = family ? family.variants : [];
  const options = ['<option value="">Sin subcategoría</option>'];
  variants.forEach((v) => options.push(`<option value="${v}">${capitalize(v)}</option>`));
  options.push('<option value="__new__">＋ Crear subcategoría…</option>');
  variantSelect.innerHTML = options.join("");

  const restored = [...variantSelect.options].some((o) => o.value === previousValue);
  variantSelect.value = restored ? previousValue : "";
  newVariantField.classList.toggle("hidden", variantSelect.value !== "__new__");
}

function showImagePreview(dataUrl) {
  imageDropzoneEmpty.classList.toggle("hidden", Boolean(dataUrl));
  imagePreview.classList.toggle("hidden", !dataUrl);
  imageRemoveBtn.classList.toggle("hidden", !dataUrl);
  if (dataUrl) imagePreview.src = dataUrl;
  if (!dataUrl) imagePreview.removeAttribute("src");
}

function processImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 700;
      let width = img.width;
      let height = img.height;
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      pendingImage = canvas.toDataURL("image/jpeg", 0.82);
      showImagePreview(pendingImage);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function fillForm(product) {
  const parts = product ? splitCategory(product.category) : { family: "", variant: "" };

  productForm.elements.id.value = product ? String(product.id) : "";
  productForm.elements.name.value = product?.name || "";
  productForm.elements.label.value = product?.label || "";
  productForm.elements.price.value = product ? String(product.price) : "";
  productForm.elements.stock.value = product ? String(product.stock) : "";
  productForm.elements.sold.value = product ? String(product.sold ?? 0) : "";
  productForm.elements.cost.value = product ? String(product.cost) : "";
  productForm.elements.description.value = product?.description || "";
  pendingImage = product?.image || null;
  showImagePreview(pendingImage);
  state.editingId = product ? product.id : null;
  cancelEditBtn.classList.toggle("hidden", !product);

  populateCategorySelect(parts.family || categoryFamilies[0]?.family || "");
  variantSelect.value = "";
  syncVariantSelect();
  if (parts.variant) {
    const exists = [...variantSelect.options].some((o) => o.value === parts.variant);
    if (exists) {
      variantSelect.value = parts.variant;
    } else {
      const opt = document.createElement("option");
      opt.value = parts.variant;
      opt.textContent = capitalize(parts.variant);
      variantSelect.insertBefore(opt, variantSelect.lastElementChild);
      variantSelect.value = parts.variant;
    }
  }
}

function resetForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  pendingImage = null;
  showImagePreview(null);
  state.editingId = null;
  const newVariantInput = document.querySelector('[name="newVariant"]');
  const newFamilyInput = document.querySelector('[name="newFamily"]');
  if (newVariantInput) newVariantInput.value = "";
  if (newFamilyInput) newFamilyInput.value = "";
  populateCategorySelect("");
  variantSelect.value = "";
  syncVariantSelect();
  cancelEditBtn.classList.add("hidden");
}

function renderCatalog() {
  const products = visibleProducts();
  catalogGrid.innerHTML = "";

  products.forEach((product) => {
    const card = productCardTemplate.content.firstElementChild.cloneNode(true);
    const productImage = card.querySelector(".product-image");
    const productLabel = card.querySelector(".product-label");
    const productName = card.querySelector(".product-name");
    const productDescription = card.querySelector(".product-description");

    card.dataset.productId = String(product.id);
    if (productImage) {
      productImage.style.background = product.image
        ? `url("${product.image}") center/cover no-repeat`
        : `linear-gradient(135deg, ${product.tone || "#a15c38"}, #1d1a17)`;
    }
    if (productLabel) {
      productLabel.textContent = product.label || "";
      productLabel.classList.toggle("hidden", !product.label);
    }
    if (productName) productName.textContent = product.name;
    if (productDescription) productDescription.textContent = product.description;
    catalogGrid.appendChild(card);
  });

  if (products.length === 0) {
    const categoryText = state.category === "all" ? "el catálogo" : `"${capitalize(state.category)}"`;
    catalogGrid.innerHTML = `<p class="panel">No hay productos en ${categoryText}${state.search ? ` con la búsqueda "${state.search}"` : ""}.</p>`;
  }
}

function renderProductsAdmin() {
  productsAdminList.innerHTML = "";
  if (state.products.length === 0) {
    productsAdminList.innerHTML = '<p class="empty-hint">Todavía no hay productos. Agregá el primero con el formulario.</p>';
    return;
  }

  state.products.forEach((product) => {
    const row = document.createElement("div");
    row.className = "admin-product-row";
    const thumbStyle = product.image
      ? `background:url("${product.image}") center/cover no-repeat`
      : `background:linear-gradient(135deg, ${product.tone || "#a15c38"}, #1d1a17)`;
    row.innerHTML = `
      <div class="admin-product-thumb" style="${thumbStyle}"></div>
      <div class="admin-product-info">
        <strong>${product.name}</strong>
        <small>${capitalize(product.category)}</small>
      </div>
      <div class="admin-product-actions">
        <button type="button" data-action="edit" data-id="${product.id}" title="Editar producto">Editar</button>
        <button type="button" data-action="delete" data-id="${product.id}" class="danger" title="Eliminar producto">Eliminar</button>
      </div>
    `;
    productsAdminList.appendChild(row);
  });
}

function renderCategoryManager() {
  const manager = document.getElementById("categoryManager");
  manager.innerHTML = "";
  if (categoryFamilies.length === 0) {
    manager.innerHTML = '<p class="empty-hint">Todavía no hay categorías.</p>';
    return;
  }

  categoryFamilies.forEach((family) => {
    const block = document.createElement("div");
    block.className = "category-manager-block";

    const head = document.createElement("div");
    head.className = "category-manager-head";
    head.innerHTML = `
      <strong>${capitalize(family.family)}</strong>
      <div class="cm-actions">
        <button type="button" data-action="rename-family" data-family="${family.family}">Renombrar</button>
        <button type="button" class="danger" data-action="delete-family" data-family="${family.family}">Eliminar</button>
      </div>
    `;
    block.appendChild(head);

    if (family.variants.length === 0) {
      const empty = document.createElement("small");
      empty.className = "category-manager-empty";
      empty.textContent = "Sin subcategorías.";
      block.appendChild(empty);
    } else {
      family.variants.forEach((variant) => {
        const row = document.createElement("div");
        row.className = "category-manager-variant";
        row.innerHTML = `
          <span>• ${capitalize(variant)}</span>
          <div class="cm-actions">
            <button type="button" data-action="rename-variant" data-family="${family.family}" data-variant="${variant}">Renombrar</button>
            <button type="button" class="danger" data-action="delete-variant" data-family="${family.family}" data-variant="${variant}">Eliminar</button>
          </div>
        `;
        block.appendChild(row);
      });
    }

    manager.appendChild(block);
  });
}

function renderAccounting() {
  const rows = state.products.map((product) => {
    const unitProfit = product.price - product.cost;
    return { product, unitProfit, totalProfit: unitProfit * product.sold };
  });

  accSheetBody.innerHTML = state.products.length
    ? rows.map(({ product, unitProfit, totalProfit }) => `
        <tr>
          <td class="acc-name">${escapeHtml(capitalize(product.name))}</td>
          <td><input class="acc-input" type="number" min="0" step="1" data-field="stock" data-id="${product.id}" value="${product.stock}" aria-label="Stock" /></td>
          <td><input class="acc-input" type="number" min="0" step="1" data-field="sold" data-id="${product.id}" value="${product.sold}" aria-label="Vendido" /></td>
          <td><input class="acc-input" type="number" min="0" step="1" data-field="cost" data-id="${product.id}" value="${product.cost}" aria-label="Costo por unidad" /></td>
          <td><input class="acc-input" type="number" min="0" step="1" data-field="price" data-id="${product.id}" value="${product.price}" aria-label="Precio de venta" /></td>
          <td class="acc-cell${unitProfit < 0 ? " acc-neg" : ""}">${formatCurrency(unitProfit)}</td>
          <td class="acc-cell${totalProfit < 0 ? " acc-neg" : ""}">${formatCurrency(totalProfit)}</td>
        </tr>`).join("")
    : '<tr><td class="acc-name" colspan="7">Todavía no hay productos. Agregá el primero en Editar catálogo.</td></tr>';

  const totalStock = state.products.reduce((sum, product) => sum + product.stock, 0);
  const totalSold = state.products.reduce((sum, product) => sum + product.sold, 0);
  const totalProfit = rows.reduce((sum, row) => sum + row.totalProfit, 0);

  accSheetFoot.innerHTML = `
      <td>Total</td>
      <td>${totalStock}</td>
      <td>${totalSold}</td>
      <td colspan="3"></td>
      <td class="${totalProfit < 0 ? "acc-neg" : ""}">${formatCurrency(totalProfit)}</td>`;

  accSheetNote.textContent = state.products.length
    ? `Ganancia total: ${formatCurrency(totalProfit)} por ${totalSold} unidades vendidas. Cambiar el "Vendido" descuenta del stock automáticamente. Ganancia/ud = precio de venta − costo.`
    : "No hay productos para contabilizar todavía.";
}

function applyAdminView(view) {
  state.adminView = view;
accNewProductBtn.addEventListener("click", () => {
  applyAdminView("catalogo");
  resetForm();
  document.getElementById("productForm").scrollIntoView({ behavior: "smooth", block: "center" });
});

accSheetBody.addEventListener("change", (event) => {
  const input = event.target.closest("input.acc-input");
  if (!input) return;
  const product = getProductById(Number(input.dataset.id));
  if (!product) return;

  const field = input.dataset.field;
  const raw = Number(input.value);

  if (field === "stock") {
    product.stock = Math.max(0, Math.floor(raw || 0));
  } else if (field === "sold") {
    const oldSold = product.sold;
    let newSold = Math.max(0, Math.floor(raw || 0));
    const maxSold = oldSold + product.stock;
    newSold = Math.min(newSold, maxSold);
    product.sold = newSold;
    product.stock = product.stock - (newSold - oldSold);
  } else if (field === "cost") {
    product.cost = Math.max(0, raw || 0);
  } else if (field === "price") {
    product.price = Math.max(0, raw || 0);
  }

  saveData();
  renderAll();
});

adminTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.adminView === view);
  });

  adminPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.adminPanel !== view);
    panel.classList.toggle("active", panel.dataset.adminPanel === view);
  });

  if (view === "categorias") {
    renderCategoryManager();
  }
}

function renderAdmin() {
  renderProductsAdmin();
  renderAccounting();
  applyAdminView(state.adminView);
  adminLoginBtn.classList.toggle("hidden", state.authenticated);
  adminLogoutBtn.classList.toggle("hidden", !state.authenticated);
  adminEditBtn.classList.toggle("hidden", !state.authenticated);
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
  modalVisual.style.background = product.image
    ? `url("${product.image}") center/cover no-repeat`
    : `linear-gradient(135deg, ${product.tone || "#a15c38"}, #1d1a17)`;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
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
  try {
    if (!authenticated) {
      sessionStorage.removeItem("mates-travel-session");
    }
  } catch {
    // Sin sesión persistente.
  }
  renderAdmin();
}

function openAdminPanel() {
  adminPanelModal.classList.remove("hidden");
  adminPanelModal.setAttribute("aria-hidden", "false");
  renderAdmin();
  resetForm();
}

function closeAdminPanel() {
  adminPanelModal.classList.add("hidden");
  adminPanelModal.setAttribute("aria-hidden", "true");
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.search.trim()) {
    state.category = "all";
  }
  renderAll();
});

catalogGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".product-card");
  const productId = Number(card?.dataset.productId);
  if (button.dataset.action === "details") {
    const product = getProductById(productId);
    if (product) {
      openWhatsApp(product);
    }
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
adminEditBtn.addEventListener("click", () => {
  openAdminPanel();
  applyAdminView("catalogo");
});
adminLogoutBtn.addEventListener("click", () => setAuthenticated(false));

adminLoginModal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.action === "close-login") {
    closeLoginModal();
  }
});

let dialogResolve = null;

function showDialog({ title = "", message = "", input = false, inputValue = "", placeholder = "", hint = "", confirmLabel = "Confirmar", cancelLabel = "Cancelar" } = {}) {
  const overlay = document.getElementById("dialogOverlay");
  const titleEl = document.getElementById("dialogTitle");
  const messageEl = document.getElementById("dialogMessage");
  const inputEl = document.getElementById("dialogInput");
  const hintEl = document.getElementById("dialogHint");
  const confirmBtn = document.getElementById("dialogConfirmBtn");
  const cancelBtn = document.getElementById("dialogCancelBtn");

  titleEl.textContent = title;
  messageEl.textContent = message;
  hintEl.textContent = hint || "";
  hintEl.classList.toggle("hidden", !hint);
  confirmBtn.textContent = confirmLabel;
  cancelBtn.textContent = cancelLabel;

  inputEl.classList.toggle("hidden", !input);
  inputEl.placeholder = placeholder || "";
  inputEl.value = input ? inputValue : "";

  overlay.classList.remove("hidden");

  setTimeout(() => {
    if (input) {
      inputEl.focus();
      inputEl.select();
    } else {
      confirmBtn.focus();
    }
  }, 0);

  return new Promise((resolve) => {
    dialogResolve = resolve;
  });
}

function closeDialog(result) {
  const overlay = document.getElementById("dialogOverlay");
  if (overlay.classList.contains("hidden")) return;
  overlay.classList.add("hidden");
  const resolve = dialogResolve;
  dialogResolve = null;
  if (resolve) resolve(result);
}

function askConfirm(options) {
  return showDialog(options);
}

function askPrompt(options) {
  return showDialog({ ...options, input: true });
}

document.getElementById("dialogConfirmBtn").addEventListener("click", () => {
  const inputEl = document.getElementById("dialogInput");
  closeDialog(inputEl.classList.contains("hidden") ? true : inputEl.value);
});

document.getElementById("dialogCancelBtn").addEventListener("click", () => closeDialog(null));

document.getElementById("dialogCloseBtn").addEventListener("click", () => closeDialog(null));

document.querySelector("#dialogOverlay .dialog-backdrop").addEventListener("click", () => closeDialog(null));

document.addEventListener("keydown", (event) => {
  const overlay = document.getElementById("dialogOverlay");
  if (overlay.classList.contains("hidden")) return;
  if (event.key === "Escape") {
    closeDialog(null);
    return;
  }
  if (event.key === "Enter") {
    const inputEl = document.getElementById("dialogInput");
    if (!inputEl.classList.contains("hidden")) {
      closeDialog(inputEl.value);
    }
  }
});

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const normalized = username.trim().toLowerCase();

  let user = dbUsers.find(
    (candidate) => String(candidate.username).trim().toLowerCase() === normalized
  );

  if (!user && remoteDb) {
    try {
      const remoteUser = await remoteDb.findUser(normalized);
      if (remoteUser) {
        user = remoteUser;
        dbUsers = dbUsers.filter(
          (candidate) => String(candidate.username).trim().toLowerCase() !== normalized
        );
        dbUsers.push(remoteUser);
        saveData();
      }
    } catch (error) {
      console.warn("No se pudo consultar el administrador en la base de datos:", error);
    }
  }

  if (!user) {
    if (dbUsers.length === 0) {
      createFirstAdmin(username);
      return;
    }
    loginError.textContent = "Ese usuario no existe.";
    loginError.classList.remove("hidden");
    return;
  }

  if (user.passwordHash === sha256(password)) {
    try {
      sessionStorage.setItem("mates-travel-session", "1");
    } catch {
      // Sin sesión persistente.
    }
    loginError.classList.add("hidden");
    closeLoginModal();
    setAuthenticated(true);
    adminLoginForm.reset();
    applyAdminView("catalogo");
    openAdminPanel();
    return;
  }

  loginError.textContent = "Contraseña incorrecta.";
  loginError.classList.remove("hidden");
});

function createFirstAdmin(username) {
  const name = String(username || "").trim();
  askPrompt({
    title: "Crear primer administrador",
    message: `No hay administradores guardados todavía (este aviso sale una sola vez). Definí una contraseña para el usuario "${name || "nuevo"}" (mínimo 6 caracteres).`,
    placeholder: "Contraseña",
  }).then((password) => {
    const cleanPassword = String(password || "").trim();
    if (cleanPassword.length < 6) {
      window.alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const user = {
      username: name || "admin",
      passwordHash: sha256(cleanPassword),
    };
    dbUsers.push(user);
    saveData();
    loginError.classList.add("hidden");
    closeLoginModal();
    setAuthenticated(true);
    adminLoginForm.reset();
    applyAdminView("catalogo");
    openAdminPanel();
  });
}

adminLoginForm.addEventListener("input", () => {
  loginError.classList.add("hidden");
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

productsAdminList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const product = getProductById(Number(button.dataset.id));
  if (!product) return;

  if (button.dataset.action === "edit") {
    fillForm(product);
  }

  if (button.dataset.action === "delete") {
    askConfirm({
      title: "Eliminar producto",
      message: `¿Eliminar "${product.name}" del catálogo?`,
      confirmLabel: "Eliminar",
    }).then((confirmed) => {
      if (!confirmed) return;
      state.products = state.products.filter((p) => p.id !== product.id);
      saveData();
      resetForm();
      renderAll();
    });
  }

  renderAll();
});

document.getElementById("repairCategoriesBtn").addEventListener("click", () => {
  askConfirm({
    title: "Reparar categorías",
    message: "¿Normalizar las categorías de los productos y re-vincular los que quedaron sueltos?",
    confirmLabel: "Reparar",
  }).then((confirmed) => {
    if (!confirmed) return;
    state.products.forEach((p) => {
      const rawCat = p.category.toLowerCase().trim();
      const parts = splitCategory(p.category);
      let normalizedFamily = parts.family;
      let normalizedVariant = parts.variant;

      if (!normalizedFamily || normalizedFamily === rawCat) {
        const searchable = `${p.name} ${rawCat} ${p.label || ""} ${p.description}`.toLowerCase();
        const byLabel = categoryFamilies.find((f) => f.family === (p.label || "").toLowerCase().trim());
        const byName = categoryFamilies.find((f) => searchable.includes(f.family));
        const matched = byLabel || byName;
        if (matched) {
          normalizedFamily = matched.family;
          normalizedVariant = matched.variants.find((v) => rawCat.includes(v)) || "";
        }
      }

      if (normalizedFamily) {
        p.category = normalizedVariant ? `${normalizedFamily} ${normalizedVariant}` : normalizedFamily;
      }
    });
    saveData();
    renderAll();
    window.alert("Listo. Categorías normalizadas y productos sueltos re-vinculados.");
  });
});

document.getElementById("categoryManager").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const familyName = button.dataset.family;
  const family = categoryFamilies.find((f) => f.family === familyName);
  const action = button.dataset.action;
  const clean = (text) => String(text || "").trim().toLowerCase().replace(/\s+/g, " ");

  if (action === "rename-family") {
    if (!family) return;
    askPrompt({
      title: "Renombrar categoría",
      message: `Nombre actual: "${capitalize(family.family)}"`,
      hint: "El cambio se aplica a todos sus productos.",
      confirmLabel: "Guardar",
    }).then((rawName) => {
      const newName = clean(rawName);
      if (!newName || newName === family.family) return;
      const oldName = family.family;
      const singular = oldName.replace(/s$/, "");
      family.family = newName;
      state.products.forEach((p) => {
        const cat = p.category.toLowerCase().trim();
        if (categoryPrefixMatches(cat, oldName)) {
          let rest = "";
          if (cat.startsWith(oldName)) rest = cat.slice(oldName.length).trim();
          else if (cat.startsWith(singular)) rest = cat.slice(singular.length).trim();
          p.category = rest ? `${newName} ${rest}` : newName;
        }
      });
      saveData();
      renderAll();
    });
  }

  if (action === "delete-family") {
    if (!family) return;
    askConfirm({
      title: "Eliminar categoría",
      message: `¿Eliminar la categoría "${capitalize(family.family)}" y todos sus productos?`,
      confirmLabel: "Eliminar",
    }).then((confirmed) => {
      if (!confirmed) return;
      const oldName = family.family;
      categoryFamilies = categoryFamilies.filter((f) => f.family !== oldName);
      state.products = state.products.filter((p) => !categoryPrefixMatches(p.category, oldName));
      saveData();
      resetForm();
      renderAll();
    });
  }

  if (action === "rename-variant") {
    if (!family) return;
    const oldVariant = button.dataset.variant;
    askPrompt({
      title: "Renombrar subcategoría",
      message: `Subcategoría actual: "${capitalize(oldVariant)}" de "${capitalize(family.family)}"`,
      hint: "El cambio se aplica a sus productos.",
      confirmLabel: "Guardar",
    }).then((rawName) => {
      const newVariant = clean(rawName);
      if (!newVariant || newVariant === oldVariant) return;
      family.variants = family.variants.map((v) => (v === oldVariant ? newVariant : v));
      state.products.forEach((p) => {
        if (p.category === `${family.family} ${oldVariant}`) {
          p.category = `${family.family} ${newVariant}`;
        }
      });
      saveData();
      renderAll();
    });
  }

  if (action === "delete-variant") {
    if (!family) return;
    const oldVariant = button.dataset.variant;
    askConfirm({
      title: "Eliminar subcategoría",
      message: `¿Eliminar la subcategoría "${capitalize(oldVariant)}"? Sus productos pasarán a "${capitalize(family.family)}".`,
      confirmLabel: "Eliminar",
    }).then((confirmed) => {
      if (!confirmed) return;
      family.variants = family.variants.filter((v) => v !== oldVariant);
      state.products.forEach((p) => {
        if (p.category === `${family.family} ${oldVariant}`) {
          p.category = family.family;
        }
      });
      saveData();
      renderAll();
    });
  }
});

categorySelect.addEventListener("change", syncVariantSelect);

variantSelect.addEventListener("change", () => {
  const isNew = variantSelect.value === "__new__";
  newVariantField.classList.toggle("hidden", !isNew);
  if (!isNew) {
    document.querySelector('[name="newVariant"]').value = "";
  }
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if (file) processImageFile(file);
});

imageDropzone.addEventListener("click", () => imageInput.click());
imageDropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    imageInput.click();
  }
});

imageRemoveBtn.addEventListener("click", () => {
  pendingImage = null;
  imageInput.value = "";
  showImagePreview(null);
});

cancelEditBtn.addEventListener("click", resetForm);

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const existingId = Number(String(productForm.elements.id.value || "").trim()) || null;
  const name = String(productForm.elements.name.value || "").trim();
  const label = String(productForm.elements.label.value || "").trim() || null;
  const description = String(productForm.elements.description.value || "").trim();
  const price = Number(productForm.elements.price.value);
  const stock = Number(productForm.elements.stock.value);
  const sold = Number(productForm.elements.sold.value);
  const cost = Number(productForm.elements.cost.value);

  if (!name || Number.isNaN(price) || Number.isNaN(stock) || Number.isNaN(sold) || Number.isNaN(cost) || !description) {
    window.alert("Completá nombre, precio, stock, unidades vendidas, costo y descripción.");
    return;
  }

  const clean = (text) => String(text || "").trim().toLowerCase().replace(/\s+/g, " ");

  let familyValue = categorySelect.value;
  let variantValue = variantSelect.value;

  if (familyValue === "__new__") {
    const newFamily = clean(document.querySelector('[name="newFamily"]').value);
    if (!newFamily) {
      window.alert("Escribí el nombre de la nueva categoría.");
      return;
    }
    const existing = categoryFamilies.find((f) => f.family === newFamily);
    familyValue = existing ? existing.family : newFamily;
    if (!existing) {
      categoryFamilies.push({ family: newFamily, variants: [] });
    }
    if (variantValue !== "__new__") {
      variantValue = "";
    }
  }

  if (variantValue === "__new__") {
    const newVariant = clean(document.querySelector('[name="newVariant"]').value);
    if (!newVariant) {
      window.alert("Escribí el nombre de la nueva subcategoría.");
      return;
    }
    const family = categoryFamilies.find((f) => f.family === familyValue);
    if (family && !family.variants.includes(newVariant)) {
      family.variants.push(newVariant);
    }
    variantValue = newVariant;
  }

  const category = variantValue ? `${familyValue} ${variantValue}` : familyValue;

  if (existingId) {
    const product = getProductById(existingId);
    if (product) {
      product.name = name;
      product.category = category;
      product.label = label;
      product.price = price;
      product.stock = stock;
      product.sold = sold;
      product.cost = cost;
      product.description = description;
      product.image = pendingImage;
    }
  } else {
    state.products.unshift({
      id: Date.now(),
      name,
      category,
      label,
      price,
      cost,
      stock,
      sold,
      description,
      tone: "#a15c38",
      image: pendingImage,
    });
  }

  saveData();
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
