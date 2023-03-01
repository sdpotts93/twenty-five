// ----------------- VARIABLES ----------------------

const calendlyWidgetButton = document.querySelector(".button.cta-white.w-button");

// All text fields
const inputTextFields = document.querySelectorAll(".bp-contact-field");

// ----------------- LISTENERS ----------------------

window.addEventListener('message', checkCalendlyEventScheduled, false);

calendlyWidgetButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  openCalendlyWidget();

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

async function openCalendlyWidget(e) {

  // Open calendly widget with prefilled info from hidden fields
  Calendly.initPopupWidget({
    url: 'https://calendly.com/twenty-five/30min',
    text: 'Schedule time with me',
    color: '#0069ff',
    textColor: '#ffffff',
    branding: true
  });
}

// Listen to calendly events using message listener, it reads the
// postmessage event Calendly sends
function checkCalendlyEventScheduled(e) {
  if (isCalendlyEvent(e)) {
    if (e.data.event == "calendly.event_scheduled") {
      const calendlyCloseButton = document.querySelector(".calendly-popup-close");
      calendlyCloseButton.addEventListener("click", () => {
        window.location.href = "https://www.twenty-five.com.au/thanks-for-booking-a-call";
      });
    }
  }
}

// Check if event is coming from calendly
function isCalendlyEvent(e) {
  return e.data.event && e.data.event.indexOf('calendly') == 0;
};
