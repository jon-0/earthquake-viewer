var map;
var form = document.getElementById('form').onsubmit = function(e){
    e.preventDefault();
}

var max = document.getElementById('maxMag');
var min = document.getElementById('minMag');
var error = document.querySelector('.error');

var startDate = flatpickr((document.querySelector('#startDate')), {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  maxDate: "today",
  onClose: function(selectedDates, dateStr, instance){
    // setDate's minimum to selected start date for validation
    endDate['config']['minDate'] = dateStr;
    endDate['hourElement']['defaultValue'] = 23;
    endDate['minuteElement']['defaultValue'] = 59;
  }
});

var endDate = flatpickr((document.querySelector('#endDate')), {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  maxDate: "today",
  defaultHour: 23,
  defaultMinute: 59,
  //minDate comes from startDate
  }
);

// date-string builder
function dateBuilder(str){
   return str.replace(" ", "T") + ":00";
}

function createRequestString(){
  var start = startDate.input.value;
  var end = endDate.input.value;
  var maxMag = max.value;
  var minMag = min.value;
  var urlString =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=";
  urlString += dateBuilder(start);
  urlString += "&endtime=";
  urlString += dateBuilder(end);
  urlString += "&minmagnitude=" + minMag;
  urlString += "&maxmagnitude=" + maxMag;
  console.log(urlString);
  return urlString;
}

function htmlBuilder(response) {
  var html = "<div id='data'>";
  // loop
  for (var i = 0; i < response.features.length; i++){
    html += "<div class='earthquake'>";
    html += "<p>" + response.features[i].properties.place + "</p>";
    html += "<p>Magnitude: " + response.features[i].properties.mag + "</p>";
    html += "</div>";
  }
  html += "</div>";
  return html;
};

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
}

function mapBuilder(response) {
  for (var i = 0; i < response.features.length; i++) {
    var coords = response.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}
// ************
// AJAX Request
// ************

var req = new XMLHttpRequest();
req.onreadystatechange = function(e) {
    e.preventDefault();
    if (this.readyState == 4 && this.status == 200) {
      var responseParagraph = document.getElementById('responseParagraph');
      var response = JSON.parse(this.responseText);
      console.log(response);
      initMap();
      mapBuilder(response);
      responseParagraph.innerHTML =
        "<h3>" + response.features.length +
        " Results:</h3>" + htmlBuilder(response);
    }
};

function search() {
  // error handling
  if (startDate.selectedDates.length == 0) {
    error.innerHTML = "You must enter a start date.";
    error.className = "error active";
  } else if (endDate.selectedDates.length == 0){
    error.innerHTML = "You must enter an end date.";
    error.className = "error active";
  } else if (parseInt(max.value) < parseInt(min.value)) {
    error.innerHTML = "Minimum Magnitude cannot exceed Maximum Magnitude."
    error.className = "error active";
  } else {
    error.innerHTML = ""; // Reset the content of the message
    error.className = "error";

    req.open("GET", createRequestString(), true);
    req.send();
    console.log("Search function triggered. Request sent.");
  }

}
