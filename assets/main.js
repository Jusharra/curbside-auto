var yearEl = document.getElementById('year');
if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

// Mobile nav: toggle the dropdown, close it after picking a link.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('header');
  if (!toggle || !header) { return; }
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  header.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Prefill the request form's service dropdown based on which ticket's
// "Request Online" button was clicked, so the customer doesn't have to
// re-state what they already told us. Only works within a single page.
document.querySelectorAll('.ticket-cta.request').forEach(function (link) {
  link.addEventListener('click', function () {
    var service = link.getAttribute('data-service');
    var select = document.getElementById('service');
    if (service && select) { select.value = service; }
  });
});

// Prefill the service dropdown from a ?service={slug} query string, for
// links that navigate to a different page first (e.g. a service card on
// /{city}/services/ linking to /{city}/contact/?service=flat-tire-change-repair).
(function prefillServiceFromQuery() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('service');
  var select = document.getElementById('service');
  if (!slug || !select) { return; }
  var option = select.querySelector('option[value="' + slug.replace(/"/g, '') + '"]');
  if (option) { select.value = slug; }
})();
