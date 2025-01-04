mapboxgl.accessToken = mapToken;

const camp = campground;

const map = new mapboxgl.Map({
  container: `map-${camp._id}`,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: camp.geometry.coordinates,
  zoom: 13
});

new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${camp.title}</h3><p>${camp.location}</p>`
        )
  )
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());