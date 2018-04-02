var form = document.getElementById('form').onsubmit = function(e){
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

// date-string builder
function dateBuilder(str){
   return str.replace(" ", "T") + ":00";
}

function createRequestString(){
  var start = startDate.input.value;
  var end = endDate.input.value;
  var urlString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=";
  urlString += dateBuilder(start);
  urlString += "&endtime=";
  urlString += dateBuilder(end);
  console.log(urlString);
  return urlString;
}

// ************
// AJAX Request
// ************

var req = new XMLHttpRequest();
req.onreadystatechange = function(e) {
    e.preventDefault();
    if (this.readyState == 4 && this.status == 200) {
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
    error.innerHTML = ""; // Reset the content of the message
    error.className = "error";

    req.open("GET", createRequestString(), true);
    req.send();
    console.log("Search function triggered. Request sent.");
  }

}
