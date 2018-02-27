function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var pusher = new Pusher('YOUR PUSHER API KEY', {
  authEndpoint: '/pusher/auth',
  cluster: 'ap1',
  encrypted: true
});

var channel = null;

if(getParameterByName('code') == null){
  alert('Make sure that the code is supplied as a query parameter, then refresh the page.');
}else{
  channel = pusher.subscribe('private-current-location-' + getParameterByName('code'));
}

var map = null;
var marker = null;

function initMap(){
  var myLatLng = {
    lat: -25.363, 
    lng: 131.044
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatLng
  });

  marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
}

if(channel){
  channel.bind('client-location', function(data) {
    console.log('message received: ', data);
    var position = new google.maps.LatLng(data.lat, data.lng);
    marker.setPosition(position);
    map.setCenter(position);
  });
}