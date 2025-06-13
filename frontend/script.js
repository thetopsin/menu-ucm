// Variables globales
const API_URL = "http://localhost:3000/api";

// Login
if (document.getElementById("login-form")) {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

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
      console.error("Error en el login:", err);
    }
  });
}

// Panel de Administración
if (document.getElementById("menu-form")) {
  const menuForm = document.getElementById("menu-form");
  const menuList = document.getElementById("menu-list");

  const loadMenus = async () => {
    try {
      const res = await fetch(`${API_URL}/menus`);
      const menus = await res.json();
      menuList.innerHTML = menus
        .map(
          (item) => `
            <li>
              <strong>Principal:</strong> ${item.plato_principal} <br>
              <strong>Agregado:</strong> ${item.agregado} <br>
              <strong>Vegano:</strong> ${item.menu_vegano} <br>
              <strong>Alternativo:</strong> ${item.menu_alternativo}
            </li>`
        )
        .join("");
    } catch (err) {
      console.error("Error al cargar menús:", err);
    }
  };

  menuForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const plato_principal = document.getElementById("menu-principal").value.trim();
    const agregado = document.getElementById("menu-agregado").value.trim();
    const menu_vegano = document.getElementById("menu-vegano").value.trim();
    const menu_alternativo = document.getElementById("menu-alternativo").value.trim();

    if (!plato_principal || !agregado || !menu_vegano || !menu_alternativo) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    const submitButton = document.querySelector("#menu-form button[type='submit']");
    if (submitButton && !submitButton.classList.contains("loading")) {
      submitButton.classList.add("loading");
      let loadingBar = submitButton.querySelector(".loading-bar");
      if (!loadingBar) {
        loadingBar = document.createElement("span");
        loadingBar.classList.add("loading-bar");
        submitButton.appendChild(loadingBar);
      }

      try {
        const res = await fetch(`${API_URL}/menus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            plato_principal,
            agregado,
            menu_vegano,
            menu_alternativo,
          }),
        });

        setTimeout(() => {
          submitButton.classList.remove("loading");
        }, 1500);

        if (res.ok) {
          menuForm.reset();
          loadMenus();
          alert("¡Se ha guardado con éxito!");
        } else {
          const error = await res.json();
          alert("Error al guardar menú: " + error.message);
        }
      } catch (err) {
        console.error("Error al guardar menú:", err);
        alert("Ocurrió un error al guardar el menú.");
      } finally {
        setTimeout(() => {
          submitButton.classList.remove("loading");
        }, 1500);
      }
    }
  });

  document.getElementById("cancel").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "admin.html";
  });

  loadMenus();
}
