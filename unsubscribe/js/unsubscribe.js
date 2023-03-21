// ----------------- VARIABLES ----------------------


const emailInput = document.getElementById("Email-Address");

// Get url params
const urlSearchParams = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(urlSearchParams.entries());

if (urlParams?.email) {
  emailInput.value = urlParams?.email;
}

// ----------------- LISTENERS ----------------------

// ----------------- FUNCTIONS ----------------------
