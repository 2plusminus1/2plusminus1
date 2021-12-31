

// Kartenhintergründe der basemap.at definieren
let baselayers = {
    toner: L.tileLayer.provider("Stamen.TonerLite"),
    osm: L.tileLayer.provider("OpenStreetMap.Mapnik")    
};
    
    
// Overlays für die Themen zum Ein- und Ausschalten definieren
let overlays = {
    Pizza: L.markerClusterGroup()
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true,
    // 43.4540/-3.8081
    center: [19.80,26.96],
    zoom: 3,
    layers: [
        baselayers.toner
    ]
});

L.control.scale().addTo(map);

// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "Toner": baselayers.toner,
    "Open Street Map": baselayers.osm
}, {
    "Pizzas Worldwide": overlays.Pizza
}).addTo(map);



// alle Overlays nach dem Laden anzeigen
overlays.Pizza.addTo(map);


let drawPizza = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        onEachFeature: (feature, layer) => { //Stellt bei jedem Marker ein Pop-up mit Namen dar
            layer.bindPopup(`<strong>${feature.properties.name}</strong>
            <hr>
            
            Overall rating: <strong>${feature.properties.overall_rating}</strong> <br>
            Estimated thickness: ${feature.properties.estimated_thickness} <br>
            <a href="${feature.properties.website}"><i class='fas fa-address-card' style='font-size:24px'></i></a>
            <a href="${"https://www.instagram.com/"+feature.properties.instagram}"><i class='fab fa-instagram-square' style='font-size:24px'></i></a>
            `)
           
            // "website": <a href="https://elias-gourmetpizza.com.au/">${click here}</a> ,
            // "instagram": "@2plusminus1"
            // Name: ${feature.properties.name}<br>
            // Food type: ${feature.properties.food_type}<br>
            
        },
        // Other Attributes:
        // "name": "Verderame Pizzeria",
        // "food_type": "Pizza",
        // "overall_rating": "5.5",
        // "estimated_thickness": "1.5"



        pointToLayer: function (feature, latlng){ //Veraendert Marker Symbol
            console.log(latlng["lat"]);
            lnglat = {
                "lat": latlng["lng"],
                "lng": latlng["lat"]
            } 
            return L.marker(lnglat, {
                icon: L.icon({
                    iconUrl: "icons/pizzaria.png",
                    iconSize: [30, 30],
                }),
            })
        }
    }).addTo(overlays.Pizza); //alternativ map wenn nicht optional sein soll
}

for (let config of DATA) {
    //console.log("Config: ", config.data)
    fetch(config.data)
        .then(response => response.json())
        .then(geoJsonData => {
            if (config.title == "Pizza") {
                console.log("Data: ", geoJsonData);
                drawPizza(geoJsonData)
            }
        })
}
