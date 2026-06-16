// Render-failsafe. Runs before hydration, independent of the React bundle.
// If the app never hydrates (very old browser, blocked/broken JS, content
// blocker), reveal content that the scroll-reveal animations leave at opacity:0.
// When the app DOES hydrate, MotionProvider sets data-hydrated and this no-ops,
// so animations run normally for healthy browsers.
addEventListener("load", function () {
  setTimeout(function () {
    if (document.documentElement.getAttribute("data-hydrated")) return;
    document
      .querySelectorAll('[style*="opacity:0"],[style*="opacity: 0"]')
      .forEach(function (e) {
        e.style.opacity = "1";
        e.style.transform = "none";
      });
  }, 3000);
});
