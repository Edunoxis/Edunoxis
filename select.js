// Theme Switcher Logic
document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll("[data-theme]");

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedTheme = button.getAttribute("data-theme");
      
      // Remove all theme classes
      document.body.classList.remove("light-theme", "blue-theme");
      
      // Add the selected theme class if it's not default (dark)
      if (selectedTheme !== "dark") {
        document.body.classList.add(`${selectedTheme}-theme`);
      }

      // Optional: save preference to localStorage
      localStorage.setItem("theme", selectedTheme);
    });
  });

  // Optional: load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && savedTheme !== "dark") {
    document.body.classList.add(`${savedTheme}-theme`);
  }
});
