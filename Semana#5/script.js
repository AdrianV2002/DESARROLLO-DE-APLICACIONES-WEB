// Galería Interactiva - Semana 5
// Requisitos: DOM (querySelector/createElement), eventos (click, input, keydown, change),
// seleccionar solo 1 imagen, eliminar seleccionada.

const imageUrlInput = document.querySelector("#imageUrl");
const addBtn = document.querySelector("#addBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const clearInputBtn = document.querySelector("#clearInputBtn");
const gallery = document.querySelector("#gallery");
const statusEl = document.querySelector("#status");
const countEl = document.querySelector("#count");

// Carga local
const fileInput = document.querySelector("#fileInput");
const uploadBtn = document.querySelector("#uploadBtn");

let selectedCard = null;

// Imágenes de ejemplo
const defaultImages = [
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
  "https://picsum.photos/800/500",
  "https://placehold.co/800x500/png"
];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "rgba(255,107,107,.95)" : "rgba(255,255,255,.78)";
}

function updateCount() {
  const total = gallery.querySelectorAll(".card").length;
  countEl.textContent = `${total} ${total === 1 ? "imagen" : "imágenes"}`;
}

function normalizeUrl(url) {
  return (url || "")
    .trim()
    .replace(/\u00A0/g, ""); // quita espacios no separables
}

function isValidHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function clearSelection() {
  if (selectedCard) selectedCard.classList.remove("selected");
  selectedCard = null;
  deleteBtn.disabled = true;
}

function selectCard(card) {
  if (selectedCard && selectedCard !== card) {
    selectedCard.classList.remove("selected");
  }
  selectedCard = card;
  selectedCard.classList.add("selected");
  deleteBtn.disabled = false;
}

function createImageCard(url, objectUrlToRevoke = null) {
  const card = document.createElement("div");
  card.className = "card adding";
  card.tabIndex = 0;

  // Si es imagen local, guardamos la objectURL para liberar memoria al borrar
  if (objectUrlToRevoke) {
    card.dataset.objectUrl = objectUrlToRevoke;
  }

  const img = document.createElement("img");
  img.alt = "Imagen de la galería";
  img.src = url;

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.textContent = "Clic para seleccionar";

  // Si falla cargar (por ejemplo Imgur 403), ponemos placeholder y avisamos
  img.addEventListener("error", () => {
    img.src = "https://placehold.co/800x500/png?text=No+se+pudo+cargar";
    caption.textContent = "❌ No se pudo cargar (URL bloqueada o inválida)";
    setStatus("No se pudo cargar. Algunos sitios (Imgur) bloquean hotlink. Prueba otra URL o carga local.", true);
  });

  // click para seleccionar
  card.addEventListener("click", () => selectCard(card));

  // seleccionar con Enter cuando el card tiene foco
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") selectCard(card);
  });

  card.appendChild(img);
  card.appendChild(caption);

  setTimeout(() => card.classList.remove("adding"), 220);
  return card;
}

function addImageFromInput() {
  const url = normalizeUrl(imageUrlInput.value);

  if (!url) {
    setStatus("Escribe una URL antes de agregar.", true);
    imageUrlInput.focus();
    return;
  }

  if (!isValidHttpUrl(url)) {
    setStatus("URL inválida. Debe iniciar con http:// o https://", true);
    imageUrlInput.focus();
    return;
  }

  const card = createImageCard(url);
  gallery.prepend(card);

  updateCount();
  setStatus("Imagen agregada ✅");
  imageUrlInput.value = "";
  imageUrlInput.focus();
}

function deleteSelected() {
  if (!selectedCard) {
    setStatus("No hay ninguna imagen seleccionada.", true);
    return;
  }

  const toRemove = selectedCard;
  toRemove.classList.add("removing");

  setTimeout(() => {
    // ✅ liberar memoria si era imagen local
    const objUrl = toRemove.dataset.objectUrl;
    if (objUrl) URL.revokeObjectURL(objUrl);

    if (toRemove.isConnected) toRemove.remove();
    clearSelection();
    updateCount();
    setStatus("Imagen eliminada 🗑️");
  }, 160);
}

/* ===== Eventos ===== */

// click
addBtn.addEventListener("click", addImageFromInput);
deleteBtn.addEventListener("click", deleteSelected);

clearInputBtn.addEventListener("click", () => {
  imageUrlInput.value = "";
  imageUrlInput.focus();
  setStatus("Campo limpiado 🧹");
});

// input (validación suave mientras escribe)
imageUrlInput.addEventListener("input", () => {
  const url = normalizeUrl(imageUrlInput.value);
  if (!url) {
    setStatus("");
    return;
  }
  if (!isValidHttpUrl(url)) {
    setStatus("La URL parece inválida… (debe ser http/https)", true);
  } else {
    setStatus("URL válida ✅ (presiona Enter para agregar)");
  }
});

// Carga local (click + change)
uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("Selecciona un archivo de imagen (jpg/png/webp).", true);
    fileInput.value = "";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const card = createImageCard(objectUrl, objectUrl);
  gallery.prepend(card);

  updateCount();
  setStatus(`Imagen local agregada ✅ (${file.name})`);

  // permitir volver a elegir el mismo archivo
  fileInput.value = "";
});

// keydown (atajos)
document.addEventListener("keydown", (e) => {
  const isTypingInInput = document.activeElement === imageUrlInput;

  // Enter para agregar URL (solo si estás escribiendo en el input)
  if (e.key === "Enter" && isTypingInInput) {
    addImageFromInput();
  }

  // Esc para deseleccionar
  if (e.key === "Escape") {
    clearSelection();
    setStatus("Selección limpiada (Esc).");
  }

  // Delete/Backspace para eliminar (Backspace no si estás escribiendo en input)
  if (e.key === "Delete" || e.key === "Backspace") {
    if (isTypingInInput && e.key === "Backspace") return;
    deleteSelected();
  }

  // Ctrl+O abrir selector local
  if (e.ctrlKey && (e.key === "o" || e.key === "O")) {
    e.preventDefault();
    fileInput.click();
  }
});

// Deseleccionar si haces click fuera
document.addEventListener("click", (e) => {
  const clickedInsideCard = e.target.closest(".card");
  const clickedInsidePanel = e.target.closest(".panel");
  if (!clickedInsideCard && !clickedInsidePanel) {
    clearSelection();
  }
});

/* ===== Cargar por defecto ===== */
defaultImages.forEach((url) => {
  const card = createImageCard(url);
  gallery.appendChild(card);
});
updateCount();
setStatus("Listo. Selecciona una imagen con clic ✨");
