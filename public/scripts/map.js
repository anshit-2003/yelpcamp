mapboxgl.accessToken =
    "pk.eyJ1IjoidGhlLWFwcHJlbmFudCIsImEiOiJjbGloNjhwb3YwbDhhM2hwN2k5amNoNXZnIn0.JJ9oI5xXoyWpv_NaJgO4gg";
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: geodata.geometry.coordinates, // starting position [lng, lat]
    zoom: 13, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(geodata.geometry.coordinates)
    .addTo(map)