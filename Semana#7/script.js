const productList = document.getElementById("productList");
const addBtn = document.getElementById("addBtn");

const products = [
  {
    name: "Teclado mecánico",
    price: 49.99,
    description: "Teclado compacto con buena respuesta."
  },
  {
    name: "Mouse inalámbrico",
    price: 19.90,
    description: "Mouse ergonómico de uso diario."
  },
  {
    name: "Audífonos",
    price: 29.50,
    description: "Audífonos cómodos con sonido balanceado."
  }
];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  productList.innerHTML = products.map(product => `
    <li class="product-item">
      <div class="product-title">
        <h3>${product.name}</h3>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <p class="desc">${product.description}</p>
    </li>
  `).join("");
}

function addProduct() {
  const next = products.length + 1;

  products.push({
    name: `Producto ${next}`,
    price: 15 + next * 2,
    description: "Producto agregado dinámicamente."
  });

  renderProducts();
}

window.addEventListener("DOMContentLoaded", renderProducts);
addBtn.addEventListener("click", addProduct);
