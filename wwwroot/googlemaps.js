let map;

function initMap() {
    const markerArray = [];
    const directionsService = new google.maps.DirectionsService();
    const mapOptions = {
        zoom: 13,
        center: { lat: 40.771, lng: -73.974 }
    };

    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    const stepDisplay = new google.maps.InfoWindow();

    calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, map);

    const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, map);
    };

    document.getElementById("start").addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);
}

function panToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, map) {
    for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    directionsService
        .route({
            origin: document.getElementById("start").value,
            destination: document.getElementById("end").value,
            travelMode: google.maps.TravelMode.WALKING,
        })
        .then((result) => {
            document.getElementById("warnings-panel").innerHTML = "<b>" + result.routes[0].warnings + "</b>";
            directionsRenderer.setDirections(result);
            showSteps(result, markerArray, stepDisplay, map);
        })
        .catch((e) => {
            window.alert("Directions request failed due to " + e);
        });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    const myRoute = directionResult.routes[0].legs[0];
    for (let i = 0; i < myRoute.steps.length; i++) {
        const marker = (markerArray[i] = markerArray[i] || new google.maps.Marker());
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, "click", () => {
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ? "Error: Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
}
