(function () {
  // Dark mode only - remove theme toggle functionality
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");

  function init() {
    // Always apply dark theme
    body.classList.remove("theme-light", "theme-auto", "light", "dark");
    body.classList.add("theme-dark");
    
    // Hide theme toggle
    if (toggle) {
      toggle.style.display = 'none';
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();


