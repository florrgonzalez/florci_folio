// Menú móvil
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

// En pantallas táctiles, tocar una card la expande; tocar otra cambia la selección.
const serviceCards = [...document.querySelectorAll(".service-card")];
serviceCards.forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    const wasActive = card.classList.contains("is-active");
    serviceCards.forEach(item => item.classList.remove("is-active"));
    if (!wasActive) card.classList.add("is-active");
  });
});

// Carrusel infinito: duplicamos el contenido original para crear un loop continuo.
const track = document.querySelector(".carousel-track");
if (track) {
  const originals = [...track.children];
  originals.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}


// MODO CLARO / OSCURO

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Recuperar el tema guardado
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

function updateThemeButton() {
  const isDark = root.getAttribute("data-theme") === "dark";

  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-pressed", isDark);
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

