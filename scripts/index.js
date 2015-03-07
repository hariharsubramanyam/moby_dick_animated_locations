(function() {
  var map;
  var oldMapOverlay;

  var isOverlaid;

  var overlayButton;

  var createOldMapOverlay = function() {
    var imageBounds = new google.maps.LatLngBounds( new google.maps.LatLng(-82.0, -180.0), new google.maps.LatLng(82.36, 167.0));
    var imageUrl = "http://localhost:8000/images/OverlayMap.jpg";
    oldMapOverlay = new google.maps.GroundOverlay(imageUrl, imageBounds,
    {
      "opacity": 0.8
    });
    isOverlaid = false;
  };

  var overlayOldMap = function() {
    oldMapOverlay.setMap(null);
    oldMapOverlay.setMap(map);
  };

  var removeOldMap = function() {
    oldMapOverlay.setMap(null);
  };

  var createMap = function() {
    var latlng = new google.maps.LatLng(0,0);
    var myOptions = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
      StreetViewControl: true,
      mapTypeControlOptions: {  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU } };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  };


  var createHandlers = function() {
    overlayButton.click(handleOverlay);
  };

  var handleOverlay = function() {
    if (isOverlaid) {
      removeOldMap();
      overlayButton.text("Overlay Old Map")
        .removeClass("btn-default")
        .addClass("btn-primary");
    } else {
      overlayButton.text("Remove Old Map")
        .removeClass("btn-primary")
        .addClass("btn-default");
      overlayOldMap();
    }
    isOverlaid = !isOverlaid;
  };

  var bindVariables = function() {
    overlayButton = $("#overlay_button");
  };

  $(document).ready(function() {
    bindVariables();
    createMap();
    createOldMapOverlay();
    createHandlers();
  });
})();
