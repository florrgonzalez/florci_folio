
// ==========================================
// MENÚ MÓVIL
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// ==========================================
// TARJETAS DE SERVICIOS
// ==========================================

const serviceCardsContainer = document.querySelector(".service-cards");
const serviceCards = serviceCardsContainer
  ? [...serviceCardsContainer.querySelectorAll(".service-card")]
  : [];

const mobileDeck = window.matchMedia("(max-width: 760px)");

let activeDrag = null;


// Calcula el espacio necesario para mostrar todo el mazo

function updateDeckHeight() {
  if (!serviceCardsContainer || !mobileDeck.matches) return;

  requestAnimationFrame(() => {
    const maxHeight = Math.max(
      ...serviceCards.map(card => card.getBoundingClientRect().height)
    );

    serviceCardsContainer.style.height = `${maxHeight + 34}px`;
  });
}


// Arrastre de las tarjetas en celular

function startCardDrag(event) {
  if (!mobileDeck.matches) return;
  if (event.target.closest("a")) return;

  const card = event.currentTarget;

  // Solo se puede arrastrar la primera tarjeta
  if (card !== serviceCardsContainer.firstElementChild) return;

  activeDrag = {
    card,
    startX: event.clientX,
    startY: event.clientY,
    deltaX: 0,
    dragging: false
  };

  card.setPointerCapture(event.pointerId);
}


function moveCardDrag(event) {
  if (!activeDrag) return;

  const { card, startX, startY } = activeDrag;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  // Evita confundir el desplazamiento vertical con un swipe
  if (!activeDrag.dragging) {
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
      activeDrag = null;
      return;
    }

    if (Math.abs(deltaX) > 8) {
      activeDrag.dragging = true;
      card.classList.add("is-dragging");
    }
  }

  if (!activeDrag.dragging) return;

  activeDrag.deltaX = deltaX;

  const rotation = deltaX * 0.06;

  card.style.transform =
    `translateX(${deltaX}px) rotate(${rotation}deg)`;

  card.style.opacity = String(
    Math.max(.5, 1 - Math.abs(deltaX) / 500)
  );
}


function endCardDrag(event) {
  if (!activeDrag) return;

  const { card, deltaX, dragging } = activeDrag;

  activeDrag = null;

  if (!dragging || Math.abs(deltaX) < 65) {
    card.classList.remove("is-dragging");
    card.style.transform = "";
    card.style.opacity = "";
    return;
  }

  const direction = deltaX > 0 ? 1 : -1;

  // La tarjeta sale hacia el lado del deslizamiento
  card.classList.remove("is-dragging");
  card.classList.add("is-leaving");

  card.style.transition = "transform .22s ease, opacity .22s ease";
  card.style.transform =
    `translateX(${direction * 450}px) rotate(${direction * 20}deg)`;
  card.style.opacity = "0";

  setTimeout(() => {
    // La tarjeta pasa al final del mazo
    serviceCardsContainer.appendChild(card);

    // Restablecer sus estilos para la nueva posición
    card.style.transition = "";
    card.style.transform = "";
    card.style.opacity = "";
    card.classList.remove("is-leaving");

    updateDeckHeight();
  }, 230);
}


// Activar y desactivar el comportamiento según el ancho de pantalla

function setupServiceCards() {
  if (!serviceCardsContainer) return;

  if (mobileDeck.matches) {
    serviceCards.forEach(card => {
      card.addEventListener("pointerdown", startCardDrag);
      card.addEventListener("pointermove", moveCardDrag);
      card.addEventListener("pointerup", endCardDrag);
      card.addEventListener("pointercancel", endCardDrag);
    });

    // Mostrar el contenido completo en móvil
    serviceCards.forEach(card => card.classList.remove("is-active"));

    updateDeckHeight();

  } else {
    serviceCards.forEach(card => {
      card.removeEventListener("pointerdown", startCardDrag);
      card.removeEventListener("pointermove", moveCardDrag);
      card.removeEventListener("pointerup", endCardDrag);
      card.removeEventListener("pointercancel", endCardDrag);

      card.style.transform = "";
      card.style.opacity = "";
      card.style.transition = "";
      card.classList.remove("is-dragging", "is-leaving", "is-active");
    });

    serviceCardsContainer.style.height = "";
  }
}


// Mantener la altura correcta si cambia el tamaño de pantalla

setupServiceCards();

mobileDeck.addEventListener("change", setupServiceCards);
window.addEventListener("resize", updateDeckHeight);


// En escritorio se conserva la interacción original de las tarjetas

serviceCards.forEach(card => {
  card.addEventListener("click", event => {
    if (mobileDeck.matches) return;
    if (event.target.closest("a")) return;

    const wasActive = card.classList.contains("is-active");

    serviceCards.forEach(item => {
      item.classList.remove("is-active");
    });

    if (!wasActive) {
      card.classList.add("is-active");
    }
  });
});


// ==========================================
// CARRUSEL INFINITO DE PROYECTOS
// ==========================================

const track = document.querySelector(".carousel-track");

if (track) {
  const originals = [...track.children];

  originals.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}


// ==========================================
// MODO CLARO / OSCURO
// ==========================================

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Recuperar el tema guardado

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}


function updateThemeButton() {
  if (!themeToggle) return;

  const isDark = root.getAttribute("data-theme") === "dark";

  themeToggle.textContent = isDark ? "☀" : "☾";

  themeToggle.setAttribute("aria-pressed", String(isDark));

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}


// Mostrar el ícono correcto al cargar

updateThemeButton();


// Cambiar el tema al hacer clic
themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";

  if (isDark) {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }

  updateThemeButton();
});

