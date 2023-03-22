// ----------------- VARIABLES ----------------------

const calendlyWidgetButton = document.querySelector(".button.cta-white.w-button");

// ----------------- LISTENERS ----------------------

calendlyWidgetButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  overlay.style.display = 'block';

  return false;
});

// ----------------- FUNCTIONS ----------------------
