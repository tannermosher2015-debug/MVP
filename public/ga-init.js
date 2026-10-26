window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-1HKYPQTCQX");
// GA4 enhanced measurement does not count tel: or mailto: taps; count them as leads.
document.addEventListener("click", function (e) {
  var a = e.target && e.target.closest ? e.target.closest("a[href^='tel:'], a[href^='mailto:']") : null;
  if (!a) return;
  gtag("event", "generate_lead", { method: a.getAttribute("href").indexOf("tel:") === 0 ? "phone" : "email" });
});
