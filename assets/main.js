document.getElementById('year').textContent = new Date().getFullYear();

// Prefill the request form's service dropdown based on which ticket's
// "Request Online" button was clicked, so the customer doesn't have to
// re-state what they already told us.
document.querySelectorAll('.ticket-cta.request').forEach(function (link) {
  link.addEventListener('click', function () {
    var service = link.getAttribute('data-service');
    var select = document.getElementById('service');
    if (service && select) { select.value = service; }
  });
});
