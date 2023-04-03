// ----------------- VARIABLES ----------------------

$("head").append(`
<style>
  #overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .meetings-iframe-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
    height: 100%;
  }

  #close-overlay {
    fill: white;
    stroke: black;
    stroke-width: 5px;
    position: absolute;
    width: 30px;
    top: 10px;
    right: 25px;
  }
</style>
`);

$('body').append(`
  <div id="overlay">
    <div class="widget">
      <div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/jay-levy/twenty-five-consultation?embed=true"></div>
    </div>
    <svg id="close-overlay" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>
  </div>
  <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
`);

const submitButton = document.getElementById("consultation");
const closeBtn = document.getElementById('close-overlay');
const overlay = document.getElementById('overlay');

// Get url params
const urlSearchParams = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(urlSearchParams.entries());

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

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  overlay.style.display = 'block';

  return false;
});

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

window.addEventListener('resize', () => {
  if (overlay.style.display === 'block') {
    overlay.style.width = window.innerWidth + 'px';
    overlay.style.height = window.innerHeight + 'px';
  }
});

// ----------------- FUNCTIONS ----------------------
