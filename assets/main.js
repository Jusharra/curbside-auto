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

// Show the optional vehicle fields (tire size, ADAS question) only when
// the selected service calls for them. Hidden fields are also disabled so
// they never submit as blank values.
function syncVehicleExtras() {
  var select = document.getElementById('service');
  if (!select) { return; }
  var opt = select.options[select.selectedIndex];
  var wanted = opt ? opt.getAttribute('data-extra') : null;
  document.querySelectorAll('[data-extra-field]').forEach(function (box) {
    var on = box.getAttribute('data-extra-field') === wanted;
    box.hidden = !on;
    box.querySelectorAll('input, select').forEach(function (el) { el.disabled = !on; });
  });
}

// Prefill the request form's service dropdown based on which ticket's
// "Request Online" button was clicked, so the customer doesn't have to
// re-state what they already told us. Only works within a single page.
document.querySelectorAll('.ticket-cta.request').forEach(function (link) {
  link.addEventListener('click', function () {
    var service = link.getAttribute('data-service');
    var select = document.getElementById('service');
    if (service && select) { select.value = service; syncVehicleExtras(); }
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

// A service chosen via ?service= (or changed by the customer) toggles the
// matching optional vehicle field.
(function vehicleFields() {
  var select = document.getElementById('service');
  if (select) { select.addEventListener('change', syncVehicleExtras); }
  syncVehicleExtras();

  // Allow next model year; refreshed at runtime so a stale build never
  // blocks a legitimate year.
  var year = document.getElementById('vehicle-year');
  if (year) { year.max = new Date().getFullYear() + 1; }
})();

// Build the form-encoded body Netlify turns into the notification email:
// dropdowns send their readable label (not the internal slug), fields go
// out in lead-sheet order, and empty optional fields are left out.
var EMAIL_FIELD_ORDER = ['form-name', 'Service', 'Name', 'Phone', 'City', 'Location',
  'Year', 'Make', 'Model', 'Tire Size', 'ADAS Sensors', 'Details', 'Page'];

function buildSubmission(form) {
  var data = new FormData(form);
  ['Service', 'City'].forEach(function (field) {
    var el = form.elements[field];
    if (el && el.tagName === 'SELECT' && el.value) {
      data.set(field, el.options[el.selectedIndex].text.trim());
    }
  });
  if (form.elements['Page']) { data.set('Page', window.location.pathname); }

  var params = new URLSearchParams();
  EMAIL_FIELD_ORDER.forEach(function (key) {
    var value = data.get(key);
    if (value !== null && String(value).trim() !== '') { params.append(key, value); }
    data.delete(key);
  });
  data.forEach(function (value, key) {
    if (key === 'bot-field' && !String(value).trim()) { return; }
    params.append(key, value);
  });
  return params.toString();
}

// Submit request forms in place (Netlify Forms via fetch) so the customer
// stays on the page and sees a confirmation instead of a redirect. No price
// or estimate is ever shown here.
document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildSubmission(form)
    }).then(function (res) {
      if (!res.ok) { throw new Error('bad status ' + res.status); }
      var done = document.createElement('div');
      done.className = 'form-result';
      done.setAttribute('role', 'status');
      done.innerHTML = '<p>Got it. We\'ll text or call you shortly with your quote.</p>';
      form.replaceWith(done);
    }).catch(function () {
      if (button) { button.disabled = false; }
      var old = form.querySelector('.form-result');
      if (old) { old.remove(); }
      var phone = document.querySelector('footer a[href^="tel:"], .contact a[href^="tel:"]') || document.querySelector('a[href^="tel:"]');
      var err = document.createElement('div');
      err.className = 'form-result is-error';
      err.setAttribute('role', 'alert');
      err.innerHTML = '<p>Something went wrong sending your request. Please try again' +
        (phone ? ' or call <a href="' + phone.getAttribute('href') + '">' + phone.textContent.trim() + '</a>' : '') + '.</p>';
      form.appendChild(err);
    });
  });
});
