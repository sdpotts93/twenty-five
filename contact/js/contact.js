// ----------------- VARIABLES ----------------------

// All text fields
const inputTextFields = document.querySelectorAll(".bp-contact-field");

// ----------------- LISTENERS ----------------------

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

document.querySelector(".footer-help").addEventListener("click", () => {
  if (!window.Beacon) {
    initHelpscoutFooter();
  } else {
    window.Beacon('open');
  }
})
// ----------------- FUNCTIONS ----------------------

function initHelpscoutFooter () {

  if (window.trackingHelpscoutDidInit) {
    return false;
  }

  // flag to ensure script does not get added to DOM more than once.
  window.trackingHelpscoutDidInit = true;

  !function(e, t, n) {
    function a() {
      var e = t.getElementsByTagName("script")[0],
        n = t.createElement("script");
      n.type = "text/javascript", n.async = !0, n.src = "https://beacon-v2.helpscout.net", e.parentNode.insertBefore(n, e)
    }
    if (e.Beacon = n = function(t, n, a) {
        e.Beacon.readyQueue.push({
          method: t,
          options: n,
          data: a
        })
      }, n.readyQueue = [], "complete" === t.readyState) return a();
    e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1)
  }(window, document, window.Beacon || function() {});

  window.Beacon('init', 'ba7a8fe2-8a9d-4a7b-ae56-770b3a9c6584');
  window.Beacon('on', 'ready', () => {
    window.Beacon('open');
  });

}