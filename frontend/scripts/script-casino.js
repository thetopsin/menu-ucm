document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".menu-button");
  const sections = document.querySelectorAll("section");

  // Observador para el menú
  const menuObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const menuButton = document.querySelector(`.menu-button[href="#${id}"]`);
        if (entry.isIntersecting) {
          menuButtons.forEach((btn) => btn.classList.remove("active"));
          menuButton.classList.add("active");
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => menuObserver.observe(section));

  // Cargar el JSON
  fetch('json/menucasino.json')
    .then(response => response.json())
    .then(data => {
      const main = document.querySelector("main");

      // Procesar categorías
      Object.keys(data).forEach(category => {
        const section = document.getElementById(category);

        if (section) {
          const container = document.createElement("div");
          container.classList.add("product-container");

          // Procesar productos
          data[category].forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            // Nombre
            const name = document.createElement("h3");
            name.textContent = product.Nombre;
            productCard.appendChild(name);

            // Precio
            const price = document.createElement("p");
            price.textContent = `$${product.Precio}`;
            productCard.appendChild(price);

            // Imagen
            if (product.Imagen) {
              const img = document.createElement("img");
              img.src = product.Imagen;
              img.alt = product.Nombre;
              productCard.appendChild(img);
            }

            container.appendChild(productCard);
          });


          section.appendChild(container);
        }
      });
    })
    .catch(error => console.error("Error al cargar el JSON:", error));
});
