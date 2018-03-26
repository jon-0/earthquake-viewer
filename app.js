//https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-03-24T00:00:00&endtime=2018-03-24T23:00:00
var requestString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"

var startDate = flatpickr((document.querySelector('#startDate')), {
  enableTime: true,
  altInput: true,
  altFormat: "F j, Y H:i",
  dateFormat: "Y-m-d H:i",
  maxDate: "today",
  onClose: function(selectedDates, dateStr, instance){
      endDate['config']['minDate'] = dateStr; // setDate's minimum to selected start date for validation
    }
  }
);

var endDate = flatpickr((document.querySelector('#endDate')), {
  enableTime: true,
  altInput: true,
  altFormat: "F j, Y H:i",
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
      // console.log(this.responseText);
      var response_Paragraph = document.getElementById('response');
      response_Paragraph.innerHTML = "<p>" + this.responseText + "</p>";
    }
  };

function search () {
  req.open("GET", "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-03-24T00:00:00&endtime=2018-03-24T23:00:00", true);
  req.send();  
  console.log("Search function triggered. Request sent.");
}


