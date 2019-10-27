// Store our API endpoint inside queryUrl
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        var color = '';
        if (feature.properties.mag > 5) {
            color = "red";
        }
        else if (feature.properties.mag > 4) {
            color = "tomato";
        }
        else if (feature.properties.mag > 3) {
          color = "orange";
        }
        else if (feature.properties.mag  > 2) {
            color = "yellow";
        }
        else if (feature.properties.mag  > 1) {
          color = "limegreen";
        }
        else {
            color = "green";
        }   
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag * 5,
        color: 'black',
        weight: 1,
        fillColor: color,
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

 

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: 'pk.eyJ1IjoiZHRob21zMyIsImEiOiJjazI3d25kZnkwbWxnM2NsYjQ5MHFtNXh3In0.Tnhw0Uh-xk1Hqfr9vueBpA'
  });

  // Create the map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude Legend</h4>";
    div.innerHTML += '<i style="background-color: green"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 0 - 1 </span><br>';
    div.innerHTML += '<i style="background-color: limegreen"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 1 - 2 </span><br>';
    div.innerHTML += '<i style="background-color: yellow"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 2 - 3 </span><br>';
    div.innerHTML += '<i style="background-color: orange"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 3 - 4 </span><br>';
    div.innerHTML += '<i style="background-color: tomato"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 4 - 5 </span><br>';
    div.innerHTML += '<i style="background-color: red"> &nbsp&nbsp&nbsp&nbsp&nbsp </i><span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 5+ </span><br>';

    return div;
  };

  legend.addTo(myMap);

}
