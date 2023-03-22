// ----------------- VARIABLES ----------------------

const calendlyWidgetButton = document.querySelector(".button.cta-white.w-button");

// All text fields
const inputTextFields = document.querySelectorAll(".bp-contact-field");

// ----------------- LISTENERS ----------------------

calendlyWidgetButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  overlay.style.display = 'block';

  return false;
});

// Change all text fields styles on focus and on blur

inputTextFields.forEach(item => {

  item.addEventListener("focus", () => {
    const label = item.parentElement.querySelector(".form-label");
    label.style.transform = 'translateY(-10px)';
    label.style.opacity = "1";
  });

  item.addEventListener("blur", () => {

    const label = item.parentElement.querySelector(".form-label");

    if (!item.value) {
      label.style.transform = 'translateY(0px)';
      label.style.opacity = "0";
    }
  });

});

// ----------------- FUNCTIONS ----------------------
