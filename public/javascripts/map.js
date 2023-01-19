
// Initialise Map
function initMap() {
    let centerControlDiv = document.createElement('div');
    centerControlDiv.index = 1;

    let map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: "terrain",
    });
    generateMap(map, photos);
}

// Change zoom level of map based on markers
function fitMapToMarkers(map, markers) {
    if (markers.length >= 1) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);
    }
}

// Add markers
function addMarkers(map, markers, photos) {
    for (let i = 0; i < photos.length; i++) {
        photo = photos[i];

        // Create Flickr photo info section
        imgLink = `<a href="${photo.webURL}" target="_blank"><img  src="${photo.photoURL}" /></a>`;
        let imgContent = '<div id="img_content">' + imgLink + '</div>';
        let infobar = `<div id="info"><a href="${photo.webURL}" target="_blank"><h3>View this original Flickr page</h3></a><div class="flex_container"><div class="imginfo">` +
            imgLink +
            `</div><div class="imginfo"><strong>Title:</strong> ${photo.title}<br>` +
            `<strong>Date:</strong> ${photo.datetaken}<br>` +
            `<strong>Username:</strong> ${photo.ownername}` +
            `</div></div>`;

        let lat = photo.latitude;
        let long = photo.longitude;
        let myLatlngMarker = new google.maps.LatLng(lat, long);

        // Create new marker position and shape
        let marker = new google.maps.Marker({
            position: myLatlngMarker,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/kml/pal4/icon49.png"
            }
        });

        // Create infoWindow popup
        let infowindow = new google.maps.InfoWindow({
            content: imgContent
        });

        // Show popup
        marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
        });

        // Close popup
        marker.addListener('mouseout', function () {
            infowindow.close(map, marker);
        });

        // Show Flickr info to message section when clicked
        marker.addListener('click', function () {
            document.getElementById('message').style.display = "none";
            document.getElementById('selectedimg').innerHTML = infobar;
        });
        markers.push(marker);
    }
}


function getMap(theMap) {
    map = theMap;
}

function getMarkers(theMarkers) {
    markers = theMarkers;
}

//Generate Map and markers
function generateMap(map, photos) {
    // Get client side map
    getMap(map);
    var markers = [];

    // Add markers
    addMarkers(map, markers, photos);

    // Get markers
    getMarkers(markers);
    // Fit map
    fitMapToMarkers(map, markers);
}


//Add onload function
window.onload = function () {
    document.getElementById('searchbutton').addEventListener('click', function () {
        let tags = document.getElementById('searchbar').value;
        let username = document.getElementById('usernamebar').value;
        // Display alert message if there is no input
        if (tags == '' && username == '') {
            alert("Please enter some keywords!!");
        } else {
            // Clear all markers
            if (typeof markers !== 'undefined') {
                removeAllMarkers(markers, markerArray);
            }
        }
    });

    if (photos.length == 0) {
        alert("Oops, no photos were found with your search keyword(s). Try different keywords.");
    }
}

