(function() {
  var map;
  var oldMapOverlay;

  var isOverlaid;
  var isSearching;

  var overlayButton;
  var slider;
  var leftLabel;
  var rightLabel;
  var searchBox;
  var searchButton;
  var seqFilterButton;

  var locationData;

  var createOldMapOverlay = function() {
    var imageBounds = new google.maps.LatLngBounds( new google.maps.LatLng(-82.0, -180.0), new google.maps.LatLng(82.36, 167.0));
    var imageUrl = "http://localhost:8000/images/OverlayMap.jpg";
    oldMapOverlay = new google.maps.GroundOverlay(imageUrl, imageBounds,
    {
      "opacity": 0.8
    });
    isOverlaid = false;
    isSearching = false;
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
    seqFilterButton.click(function() {
      handleSeqFilter();
    });
    searchButton.click(handleSearch);
  };

  var handleSearch = function() {
    if (isSearching) {
      searchButton.text("Search")
        .removeClass("btn-default")
        .addClass("btn-primary");
      searchBox.text("");
      handleSeqFilter();
    } else {
      searchButton.text("Cancel")
        .removeClass("btn-primary")
        .addClass("btn-default");
      var str = searchBox.val();
      var fn = handleSeqFilter(true);
      filterMarkers(function(loc) {
        return fn(loc) && loc.quote.indexOf(str) != -1;
      });
    }
    isSearching = !isSearching;
  };

  var handleSeqFilter = function(defer) {
    var min = parseInt(leftLabel.text(), 10);
    var max = parseInt(rightLabel.text(), 10);
    var fn = function(loc) {
      return min <= loc.seq_no && loc.seq_no <= max;
    };
    if (defer) {
      return fn;
    }
    filterMarkers(fn);
  };

  var filterMarkers = function(fn) {
    locationData.forEach(function(loc) {
      loc.marker.setMap(null);
      if (fn(loc)) {
        loc.marker.setMap(map);
      }
    });
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
    slider = $(".nstSlider");
    leftLabel = $(".leftLabel");
    rightLabel = $(".rightLabel");
    searchBox = $("#filter_term");
    searchButton = $("#filter_button");
    seqFilterButton = $("#seq_filter");
  };

  var loadLocationData = function(callback) {
    $.get("data/md-locations.json", function(data) {
      locationData = data;
      callback();
    });
  };

  var createMarkers = function() {
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .4,
        scale: 4.5,
        strokeColor: 'white',
        strokeWeight: 1
    };
    locationData.forEach(function(loc) {
      var infoWindow = new google.maps.InfoWindow({
        "content": "<p style='color: black'><strong>Quote:</strong> " + loc.quote + "</p>"
          + "<p style='color: black'><strong>Seq No:</strong> " + loc.seq_no + "</p>"
          + "<p style='color: black'><strong>Page No:</strong> " + loc.page_no + "</p>"
          + "<p style='color: black'><strong>Line No:</strong> " + loc.line_no + "</p>"
      });
      loc.marker = new google.maps.Marker({
        "position": new google.maps.LatLng(loc.lat, loc.lon),
        "map": map,
        "title": loc.quote,
        "icon": circle
      });
      google.maps.event.addListener(loc.marker, "click", function() {
        infoWindow.open(map, loc.marker);
      });
    });
  };

  var createSlider = function() {
    slider.data("range_max", locationData.length)
      .data("cur_max", locationData.length)
      .nstSlider({
        "rounding": 1,
        "left_grip_selector": ".leftGrip",
        "right_grip_selector": ".rightGrip",
        "value_bar_selector": ".bar",
        "value_changed_callback": function(cause, leftValue, rightValue) {
          leftLabel.text(pad(leftValue, 4));
          rightLabel.text(pad(rightValue, 4));
        }
    });
  };

  var pad = function(str, len) {
    str = "" + str;
    while (str.length < len) {
      str = "0" + str;
    }
    return str;
  };

  $(document).ready(function() {
    loadLocationData(function() {
      bindVariables();
      createMap();
      createSlider();
      createOldMapOverlay();
      createHandlers();
      createMarkers();
    });
  });
})();
