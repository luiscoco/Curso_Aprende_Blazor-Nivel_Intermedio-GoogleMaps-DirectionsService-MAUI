# How to draw a GoogleMaps Route in a MAUI Blazor application

## 1. Create a new MAUI Blazor application in Visual Studio 2022 Community Edition

Please refer to this publication for setting up yout environment:

https://github.com/luiscoco/Curso_Aprende_Blazor-Nivel_Intermedio-GoogleMaps-SimpleMap-MAUI

## 2. Create a new JavaScript file

![image](https://github.com/user-attachments/assets/4ad77a31-ec58-40ef-b301-2c7c531d18fd)

Include this code in the **googlemaps.js** file:

```javascript
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
```

## 3. Include the JavaScript file reference in the index.html file

Include this code in the index.html

```
<script src="googlemaps.js"></script>
```

## 4. Include the Google Maps API reference in the index.html file

Include this code in the index.html 

```
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoENaJ45__VPv8SBlkZM6F4ehh0peXMAQ"
        defer></script>
```

For creating the **Google Maps API Key** see this publication for more info: https://github.com/luiscoco/Curso_Aprende_Blazor-Nivel_Intermedio-GoogleMaps-SimpleMap-MAUI

See the modified **index.html** file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>MAUI_GoogleMaps_SimpleMap</title>
    <base href="/" />
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="css/app.css" />
    <link rel="stylesheet" href="MAUI_GoogleMaps_SimpleMap.styles.css" />
    <link rel="icon" href="data:,">
</head>

<body>

    <div class="status-bar-safe-area"></div>

    <div id="app">Loading...</div>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>

    <script src="_framework/blazor.webview.js" autostart="false"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoENaJ45__VPv8SBlkZM6F4ehh0peXMAQ"
            defer></script>
    <script src="googlemaps.js"></script>


</body>

</html>
```

## 5. Create a new razor component for the Google Map

See the new **GoogleMaps.razor** component

![image](https://github.com/user-attachments/assets/662a08b3-3b03-45b7-8acf-1021f165d4d8)

Add this code in the **GoogleMaps.razor**

```razor
@page "/googleMaps"

@inject IJSRuntime JSRuntime

<h3>Google Maps with Geolocation</h3>

<div id="floating-panel">
    <b>Start: </b>
    <select id="start">
        <option value="penn station, new york, ny">Penn Station</option>
        <option value="grand central station, new york, ny">
            Grand Central Station
        </option>
        <option value="625 8th Avenue, New York, NY, 10018">
            Port Authority Bus Terminal
        </option>
        <option value="staten island ferry terminal, new york, ny">
            Staten Island Ferry Terminal
        </option>
        <option value="101 E 125th Street, New York, NY">
            Harlem - 125th St Station
        </option>
    </select>
    <b>End: </b>
    <select id="end">
        <option value="260 Broadway New York NY 10007">City Hall</option>
        <option value="W 49th St & 5th Ave, New York, NY 10020">
            Rockefeller Center
        </option>
        <option value="moma, New York, NY">MOMA</option>
        <option value="350 5th Ave, New York, NY, 10118">
            Empire State Building
        </option>
        <option value="253 West 125th Street, New York, NY">
            Apollo Theater
        </option>
        <option value="1 Wall St, New York, NY">Wall St</option>
    </select>
</div>

<!-- This is the missing element to display warnings -->
<div id="warnings-panel" style="color: red;"></div>

<div id="map-container">
    <div id="map" style="height: 400px; width: 100%;"></div>
</div>

<!-- Button to trigger geolocation and center the map -->
<button class="btn btn-primary" @onclick="PanToCurrentLocation">Pan to Current Location</button>

@code {
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Call the JS function to initialize the map when the page first renders
            await JSRuntime.InvokeVoidAsync("initMap");
        }
    }

    private async Task PanToCurrentLocation()
    {
        // Optionally, call this to re-pan to the user's location
        await JSRuntime.InvokeVoidAsync("panToCurrentLocation");
    }
}
```

## 6. Run the appplication in Windows Desktop

See this publication for more info: https://github.com/luiscoco/Curso_Aprende_Blazor-Nivel_Intermedio-GoogleMaps-SimpleMap-MAUI

![image](https://github.com/user-attachments/assets/62063706-4e70-4326-97ab-08d7a929d790)

![image](https://github.com/user-attachments/assets/87fafb54-ed3e-4413-a6fe-234fde4d6955)

## 7. Run the application in your Mobile Device

See this publication for more info: https://github.com/luiscoco/Curso_Aprende_Blazor-Nivel_Intermedio-GoogleMaps-SimpleMap-MAUI

![image](https://github.com/user-attachments/assets/beedeaef-29c0-4f5f-a6e5-b7418d92292e)



