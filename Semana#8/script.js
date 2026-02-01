const productos = [
    { nombre: "Procesador i9", desc: "16 núcleos, 5.2GHz", precio: 599.99 },
    { nombre: "Tarjeta Gráfica", desc: "RTX 4080 16GB VRAM", precio: 1199.00 },
    { nombre: "Memoria RAM", desc: "32GB DDR5 6000MHz", precio: 150.50 }
];

const productList = document.querySelector("#productList");
const alertBtn = document.querySelector("#alertBtn");
const contactForm = document.querySelector("#contactForm");
const statusMsg = document.querySelector("#status");

function mostrarProductos() {
    productList.innerHTML = productos.map(p => `
        <tr>
            <td class="fw-bold">${p.name || p.nombre}</td>
            <td class="text-muted">${p.desc}</td>
            <td class="text-end text-info fw-bold">$${p.precio.toFixed(2)}</td>
        </tr>
    `).join("");
}

alertBtn.addEventListener("click", () => {
    alert("✨ ¡Bienvenido! Has interactuado con el botón de JavaScript correctamente.");
});

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nombre = document.querySelector("#nameInput").value.trim();
    const email = document.querySelector("#emailInput").value.trim();
    const mensaje = document.querySelector("#messageInput").value.trim();

    if (nombre === "" || email === "" || mensaje === "") {
        statusMsg.innerHTML = "Por favor, rellena todos los campos obligatorios.";
        statusMsg.style.color = "#ff6b6b";
    } else if (!email.includes("@")) {
        statusMsg.innerHTML = "El formato del correo no es válido.";
        statusMsg.style.color = "#ff6b6b";
    } else {
        statusMsg.innerHTML = "¡Formulario enviado con éxito! Nos contactaremos pronto.";
        statusMsg.style.color = "#00d2ff";
        contactForm.reset();
    }
});

document.querySelector("#addBtn").addEventListener("click", () => {
    productos.push({
        nombre: "Nuevo Item",
        desc: "Descripción automática",
        precio: Math.random() * 100
    });
    mostrarProductos();
});

document.addEventListener("DOMContentLoaded", mostrarProductos);