// Add console.log to check to see if our code is working.
console.log("working");

// We create the streets tile layer that will be an option for the map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// We create the satellite tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Create a base later that holds both maps.
let baseMaps = {
  "Streets": streets,
  "Satellite Street": satelliteStreets
};
 
// Create the map object with a center and zoom level.
let map = L.map("mapid", {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [satelliteStreets]
});

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
}

// Pass map layers into the layer control and add the layer control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

// This function controls the magnitude colour.
function getColor(magnitude) {
  return  magnitude > 5  ? '#ea2c2c' :
          magnitude > 4  ? '#ea822c' :
          magnitude > 3  ? '#ee9c00' :
          magnitude > 2  ? '#eecc00' :
          magnitude > 1  ? '#d4ee00' :
                           '#98ee00' ;
  }
 
// This function creates the magnitude for the map
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend.
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
	    for (var i = 0; i < magnitudes.length; i++) {
	    	console.log(colors[i])
	        div.innerHTML +=
	            '<i style="background:' + colors[i] + '"></i> ' +
	            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
	    }

	    return div;
};

legend.addTo(map);


// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, {

  pointToLayer: function(feature, latlng) {
    console.log(data);
    return L.circleMarker(latlng);
},
      // We set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
      // We create a popup for each circleMarker to display the magnitude and
      //  location of the earthquake after the marker has been created and styled.
      onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "</h3> <hr> Location: " + feature.properties.place );
      }
    }).addTo(earthquakes);
    //Then we add the earthquake layer to the map.
  earthquakes.addTo(map);
});