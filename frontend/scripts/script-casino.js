document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".menu-button");
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
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

  sections.forEach((section) => observer.observe(section));
});
