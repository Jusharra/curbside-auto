// Renders the brand's Google Maps embeds: single-city coverage maps (city hub pages)
// and the multi-city network map (the Locations page). Loaded via the Maps JS API
// callback (see data/config.json for the API key + README for setup).

function curbsideMapStyle() {
  return [
    { elementType: 'geometry', stylers: [{ color: '#1C2027' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#14171C' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9098A6' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2A3038' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2A3038' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5C6270' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3A4148' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0F1216' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1C2027' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] }
  ];
}

function milesToMeters(mi) {
  return mi * 1609.34;
}

function baseMapOptions(center) {
  return {
    center: center,
    styles: curbsideMapStyle(),
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  };
}

function drawCoverageCircle(map, center, radiusMiles) {
  return new google.maps.Circle({
    strokeColor: '#F5B301',
    strokeOpacity: 0.9,
    strokeWeight: 2,
    fillColor: '#F5B301',
    fillOpacity: 0.12,
    map: map,
    center: center,
    radius: milesToMeters(radiusMiles)
  });
}

function initSingleCityMap(el) {
  var center = { lat: parseFloat(el.dataset.lat), lng: parseFloat(el.dataset.lng) };
  var radiusMiles = parseFloat(el.dataset.radiusMiles || '0');
  var map = new google.maps.Map(el, baseMapOptions(center));
  new google.maps.Marker({ position: center, map: map, title: el.dataset.cityLabel || '' });
  if (radiusMiles > 0) {
    var circle = drawCoverageCircle(map, center, radiusMiles);
    map.fitBounds(circle.getBounds());
  } else {
    map.setZoom(11);
  }
}

function initNetworkMap(el, cities) {
  var bounds = new google.maps.LatLngBounds();
  var map = new google.maps.Map(el, baseMapOptions({ lat: cities[0].lat, lng: cities[0].lng }));
  cities.forEach(function (c) {
    var pos = { lat: c.lat, lng: c.lng };
    new google.maps.Marker({ position: pos, map: map, title: c.name });
    if (c.radiusMiles) {
      var circle = drawCoverageCircle(map, pos, c.radiusMiles);
      bounds.union(circle.getBounds());
    } else {
      bounds.extend(pos);
    }
  });
  map.fitBounds(bounds);
}

// Called by the Maps JS API script tag once it finishes loading (see the
// `callback=initCurbsideMaps` param on the script src in each page template).
window.initCurbsideMaps = function () {
  document.querySelectorAll('[data-single-map]').forEach(initSingleCityMap);
  var networkEl = document.getElementById('network-map');
  if (networkEl && window.NETWORK_CITIES && window.NETWORK_CITIES.length) {
    initNetworkMap(networkEl, window.NETWORK_CITIES);
  }
};
