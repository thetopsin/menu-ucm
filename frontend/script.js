// Variables globales
const API_URL = "http://localhost:3000/api";

// Login (deja igual si no cambiaste login.html)
if (document.getElementById("login-form")) {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "admin.html";
      } else {
        errorMessage.textContent = data.message;
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// Panel de Administración
if (document.getElementById("menu-form")) {
  const menuForm = document.getElementById("menu-form");
  const menuList = document.getElementById("menu-list");

  // Función para cargar los menús y mostrarlos
  const loadMenus = async () => {
    try {
      const res = await fetch(`${API_URL}/menus`);
      const menus = await res.json();
      menuList.innerHTML = menus
        .map(
          (item) =>
            `<li>
              <strong>Principal:</strong> ${item.plato_principal} <br>
              <strong>Agregado:</strong> ${item.agregado} <br>
              <strong>Vegano:</strong> ${item.menu_vegano} <br>
              <strong>Alternativo:</strong> ${item.menu_alternativo}
            </li>`
        )
        .join("");
    } catch (err) {
      console.error(err);
    }
  };

  // Al enviar el formulario, guarda el menú nuevo
  menuForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    alert("Se a guardado con exito!");
    const plato_principal = document.getElementById("menu-principal").value;
    const agregado = document.getElementById("menu-agregado").value;
    const menu_vegano = document.getElementById("menu-vegano").value;
    const menu_alternativo = document.getElementById("menu-alternativo").value;

    try {
      const res = await fetch(`${API_URL}/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          plato_principal,
          agregado,
          menu_vegano,
          menu_alternativo,
        }),
      });

      if (res.ok) {
        menuForm.reset();
        loadMenus();
      } else {
        const error = await res.json();
        alert("Error al guardar menú: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Botón logout
  document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  // Cargar menús al cargar la página
  loadMenus();
}

// Página Pública (index.html) queda igual o la adaptamos después
