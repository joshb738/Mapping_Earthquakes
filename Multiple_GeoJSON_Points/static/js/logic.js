// Add console.log to check to see if our code is working.
console.log("working");

// We create the street layer that will be the default background of the map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});
 
// We create the dark view tile layer that will be an option for the map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  Street: streets, 
  Dark: dark
};

// Create the map object with center, zoom level and default layer.
let map = L.map("mapid", {
  center: [30, 30],
  zoom: 2,
  layers: [streets]
});

// Pass map layers into the layer control and add the layer control to the map.
L.control.layers(baseMaps).addTo(map);

// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/joshb738/Mapping_Earthquakes/main/majorAirports.json";

// Grabbing our GeoJSON data.
d3.json(airportData).then(function(data) {
  console.log(data);

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
  pointToLayer: function(feature, latlng) {
    console.log(feature);
    return L.marker(latlng)
    .bindPopup(
      "<h3>" + feature.properties.name + 
      "</h3> <hr> <h3>Airport Code: " + feature.properties.faa + "</h3>");

    }}).addTo(map);
});




