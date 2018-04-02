//https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-03-24T00:00:00&endtime=2018-03-24T23:00:00
// Sun Apr 01 2018 12:00:00 GMT-0400 (EDT)

document.getElementById('form').onsubmit = function(e){
    e.preventDefault();
}

var requestString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
var error = document.querySelector('.error');

var startDate = flatpickr((document.querySelector('#startDate')), {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  maxDate: "today",
  onClose: function(selectedDates, dateStr, instance){
      endDate['config']['minDate'] = dateStr; // setDate's minimum to selected start date for validation
    }
  }
);

var endDate = flatpickr((document.querySelector('#endDate')), {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  maxDate: "today",
  defaultHour: 23,
  defaultMinute: 59,
  //minDate comes from startDate
  }
);

// ************
// AJAX Request
// ************

var req = new XMLHttpRequest();
req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.readyState, this.status);
      var response_Paragraph = document.getElementById('response');
      response_Paragraph.innerHTML = "<p>" + this.responseText + "</p>";
      console.log(startDate.input.value);
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
  } else {
    req.open("GET", "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-03-24T00:00:00&endtime=2018-03-24T23:00:00", true);
    req.send();
    console.log("Search function triggered. Request sent.");
  }

}
