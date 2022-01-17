// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    }).addTo(myMap);

function magcolour(mag){
    if (mag < 1) {
        return "#00ED01";//"rgb(183,243,77)";
        } else if (mag < 2) {
        return "#CEFB02";//"rgb(225,243,77)";
        } else if (mag < 3) {
        return "#FEFB01";//"rgb(243,219,77)";
        } else if (mag < 4) {
        return "#FFCE03";//"rgb(243,219,77)";
        } else if (mag < 5) {
        return "#FD9A01";//"rgb(234,130,44)";
        } else {
        return "#F00505"; //"rgb((240,107,107)";
        }
    }



// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(data => {
    data.features.forEach(d => {
        console.log(d);

        L.circle([d.geometry.coordinates[1],d.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: magcolour(d.properties.mag),
            fillColor: magcolour(d.properties.mag),
            radius: (d.properties.mag*10000)
            }).bindPopup("<h1>" + d.properties.place + "</h1> <hr> <h3>Magnitude: " + d.properties.mag + "</h3>").addTo(myMap);
    })
});

//Create the legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        magrange = ["0", "1", "2", "3", "4", "5"],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magrange.length; i++) {
        div.innerHTML +=
            "<i style='background:" + magcolour(magrange[i]) + "'></i> " +
            magrange[i] + (magrange[i + 1] ? "&ndash;" + magrange[i + 1] + "<br>" : "+");
    }
    return div;
};
legend.addTo(myMap);