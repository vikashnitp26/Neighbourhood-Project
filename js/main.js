"use strict";

//Error handling - checks if Google Maps has loaded
if (!window.google || !window.google.maps){
  $('#map-container').text('Error: Google Maps data could not be loaded');
  $('#map-list').text('Error: Google Maps data could not be loaded');
}

// --------- MODEL ---------------

var markersModel = [
  {
    title: "Chutneys",
    category: "restaurant",                         // category for search field
    address: "Chutneys ,Food Court, Level 4, Inorbit Mall, Hyderabad, Telangana 500051", // street address for use by Google Maps geocoder
    
    phone: "(+91) 040 4488 0000",                         
    status: ko.observable("OK"),                    // change status if error message received from 
    marker: new google.maps.Marker({               // google maps marker object
      position: new google.maps.LatLng(0,0),          // set initial position to (0,0)
      icon: "img/restaurant.png"                 // category icon for map pin
    })
  },
  {
    title: "Cafe Coffee Day ",
    category: "coffee",
    address: "Cafe Coffee Day ,Raheja Mind Space, Madhapur, Hyderabad, Telangana 500081",
    phone: "(+91) 9391415714",
    status: ko.observable("OK"),
    marker: new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/coffee.png"
    })
  },
  {
    title: "Starbucks",
    category: "coffee",
    address: "Starbucks ,Building 9, Ground Floor, Mindspace, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081",
    phone: "(+91) 077998 00994",
    status: ko.observable("OK"),
    marker: new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/coffee.png"
    })
  },
  {
    title: "Swaad Restaurant",
    category: "restaurant",
    address: "Swaad Restaurant ,Plot No:70, Arunodaya Colony, Madhapur, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081",
    phone: "(+91)  093467 26039",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/restaurant.png"
    })
  },
  {
    title: "Kangan",
    category: "restaurant",
    address: "Kangan ,Survey No.64, HUDA Techno Enclave, Raheja IT Park, Hitech City, Madhapur, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081",
    phone: "(+91) 040 6767 6838",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/restaurant.png"
    })
  },
  {
    title: "Cafe' Reboot - Bar & Kitchen",
    category: "pub",
    address: "Cafe' Reboot - Bar & Kitchen, PLOT 11/2, SECTOR 1, Huda Techno Eclave., Behind Pride Honda, Madhapur, Hyderabad, Telangana 500081",
    phone: "(+91) 283-4548",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/bar.png"
    })
  },
  
  {
    title: "Beer House",
    category: "pub",
    address: "Beer House ,L2, Inorbit Mall Road, Madhapur, Hitech City, Telangana 500081",
    phone: "(+91) 082972 99665",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/bar.png"
    })
  },
  {
    title: "Westin Hyderabad Mindspace",
    category: "restaurant",
    address: " Raheja IT Park, Mindspace, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081",
    phone: "(+91) 040 6767 6767",
    status: ko.observable("OK"),
    
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/restaurant.png"
    })
  },
  {
    title: "Reliance Fresh",
    category: "grocery",
    address: "Reliance Fresh ,Vittal Rao Nagar Rd, Vittal Rao Nagar, HITEC City, Hyderabad, Telangana 500081",
    phone: "(+91) 040 6463 7805",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/supermarket.png"
    })
  },
  {
    title: 'Heritage Fresh',
    category: "grocery",
    address: "Heritage Fresh ,Vittal Rao Nagar Rd, Vittal Rao Nagar, HITEC City, Hyderabad, Telangana 500081",
    phone:"(+91) 040 4424 9590",
    status: ko.observable("OK"),
    marker : new google.maps.Marker({
      position: new google.maps.LatLng(0,0),
      icon: "img/supermarket.png"
    })
  }
];
// ---------------------------------- VIEWMODEL ------------------------------

var resultMarkers = function(members){
  var self = this;

  self.mapOptions = {
    center: new google.maps.LatLng(17.4422926,78.384979), //set map center in Mindspace
    zoom: 16
  };

  var mapCont = document.getElementsByClassName('map-container');

  self.map = new google.maps.Map(mapCont[0], self.mapOptions);

  self.infowindow = new google.maps.InfoWindow({ maxWidth:250 });

  self.searchReq = ko.observable('');     //user input to Search box

  // Filtered version of data model, based on Search input
  self.filteredMarkers = ko.computed(function() {
    //Remove all markers from map
    var len = members.length;
    for (var i = 0; i < len; i++) {
      members[i].marker.setMap(null);
      clearTimeout(members[i].timer);
    }
    //Place only the markers that match search request
    var arrayResults = [];
    arrayResults =  $.grep(members, function(a) {
      var titleSearch = a.title.toLowerCase().indexOf(self.searchReq().toLowerCase());
      var catSearch = a.category.toLowerCase().indexOf(self.searchReq().toLowerCase());
      return ((titleSearch > -1 || catSearch > -1) && a.status() === 'OK');
    });
    //Iterate thru results, set animation timeout for each
    var len = arrayResults.length;
    for (var i = 0; i < len; i++){
      (function f(){
        var current = i;
        var animTimer = setTimeout(function(){arrayResults[current].marker.setMap(self.map);}, i * 300);
        arrayResults[current].timer = animTimer;
      }());
    }
    //Return list of locations that match search request, for button list
    return arrayResults;
  });

  //Use street address in model to find LatLng
  self.setPosition = function(location){
    var geocoder = new google.maps.Geocoder();
    //use address to find LatLng with geocoder
    geocoder.geocode({ 'address': location.address }, function(results, status) {
      if (status === 'OK'){
        location.marker.position = results[0].geometry.location;
        location.marker.setAnimation(google.maps.Animation.DROP);
      } else if (status === 'OVER_QUERY_LIMIT'){
        // If status is OVER_QUERY_LIMIT, then wait and re-request
        console.log("in over limit");
        setTimeout(function(){
          geocoder.geocode({ 'address': location.address }, function(results, status) {
              location.marker.position = results[0].geometry.location;
              location.marker.setAnimation(google.maps.Animation.DROP);
            });
        }, 2000);

      } else {
        //If status is any other error code, then set status to Error, which will remove it from list and map
        location.status('ERROR');
        //Log error information to console
        console.log('Error code: ', status, 'for Location:', location.title);
      }
    });
  };

  //Adds infowindows to each marker and populates them 
  self.setBubble = function(index){
    //Add event listener to each map marker to trigger the corresponding infowindow on click
    google.maps.event.addListener(members[index].marker, 'click', function () {

      //Request  info, then format it, and place it in infowindow
      

        //Can you clarify the following code review comment on this segment?
        //"This text template is one part of View so you can move it into index.html."
        var contentString =
                            "<h5>" + members[index].title +"</h5>" +
                            "<p>" + members[index].address + "</p>" +
                            "<p>" + members[index].phone + "</p>" 
                            ;
        self.infowindow.setContent(contentString);
      

      self.infowindow.open(self.map, members[index].marker);
  });
};

  //Iterate through data model, get LatLng location then set up infowindow
  self.initialize = function(){
    for (var current in members){
      self.setPosition(members[current]);
      self.setBubble(current);
    }
  };

  //Toggle bounce animation for map marker on click of Location list button (via data-binding)
  self.toggleBounce = function(currentMarker) {
    if (currentMarker.marker.getAnimation() !== null) {
      currentMarker.marker.setAnimation(null);
    } else {
      self.map.setCenter(currentMarker.marker.position);       //center map on bouncing marker
      currentMarker.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){currentMarker.marker.setAnimation(null);}, 1500); //bounce for 1500 ms
    }
  };
};

//----

var myMarkers = new resultMarkers(markersModel);
ko.applyBindings(myMarkers);
google.maps.event.addDomListener(window, 'load', myMarkers.initialize);
