// ----------------- VARIABLES ----------------------

// All text fields
const inputTextFields = document.querySelectorAll(".bp-contact-field");

// Get url params
const urlSearchParams = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(urlSearchParams.entries());

if (urlParams?.newsletterSuccess) {
  const emailForm = document.querySelector("#email-form");
  const newsletterForm = document.querySelector("#wf-form-newsletter-subscription");

  const emailFormDone = emailForm.parentElement.querySelector(".w-form-done");

  const newsletterFormDone = newsletterForm.parentElement.querySelector(".w-form-done");

  [emailFormDone, newsletterFormDone].forEach(item => {
    item.style.display = "block";
  });

  const newsletterForms = document.querySelectorAll("#email-form, #wf-form-newsletter-subscription");

  newsletterForms.forEach(item => {
    item.style.display = "none";
  });
}

if (urlParams?.newsletterFail) {
  const emailForm = document.querySelector("#email-form");
  const newsletterForm = document.querySelector("#wf-form-newsletter-subscription");

  const emailFormDone = emailForm.parentElement.querySelector(".w-form-fail");

  const newsletterFormDone = newsletterForm.parentElement.querySelector(".w-form-fail");

  [emailFormDone, newsletterFormDone].forEach(item => {
    item.style.display = "block";
  });
  const newsletterForms = document.querySelectorAll("#email-form, #wf-form-newsletter-subscription");

  newsletterForms.forEach(item => {
    item.style.display = "none";
  });
}

const newsletterOverlay = document.getElementById("newsletter-overlay");

const newsLetterStorageClose = window.localStorage.getItem("newsletterClose");

let tempDate = new Date();
const today = new Date();

if (newsLetterStorageClose) {
  tempDate = new Date(newsLetterStorageClose);
  tempDate = new Date(tempDate.setDate(tempDate.getDate() + 60));
}

if (
  !newsLetterStorageClose ||
  (
    newsLetterStorageClose &&
    today.getTime() > tempDate.getTime()
  )
) {
  newsletterOverlay.style.opacity = "0";
  newsletterOverlay.style.display = "flex";
  setTimeout(() => {
    newsletterOverlay.style.opacity = "1";
  }, 10);
}

const newsletterClose = document.getElementById("close-button");

// ----------------- LISTENERS ----------------------

newsletterClose.addEventListener("click", () => {
  newsletterOverlay.style.opacity = "0";

  localStorage.setItem("newsletterClose", new Date());

  setTimeout(() => {
    newsletterOverlay.style.display = "none";
  }, 500);
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
