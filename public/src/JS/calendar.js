var monthStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getWeek(today){
  var d = new Date();

  var dateOne = chrono.parseDate('This Sunday', today);
  var dateTwo = chrono.parseDate('This Saturday', today);

  if (d.getDay() === 0) dateOne = chrono.parseDate("Today", today);
  if (d.getDay() === 6) dateTwo = chrono.parseDate("Today", today);

  return {begin: dateOne, end: dateTwo};
}

$(document).ready(function() {
  var timeObj = getWeek(chrono.parseDate("Today")), dateOne = timeObj.begin, dateTwo = timeObj.end;
  var dateOneStr = monthStr[dateOne.getMonth()] + " " + dateOne.getDate(),
    dateTwoStr = "";

  if (dateOne.getMonth() == dateTwo.getMonth()) dateTwoStr += dateTwo.getDate();
  else dateTwoStr += monthStr[dateTwo.getMonth()] + " " + dateTwo.getDate();
  $("#date1").text(dateOneStr);
  $("#date2").text(dateTwoStr);

  $.get("/getTimeSlots", function( data ) {
    data.forEach(function(time){
      if(inWeek(time, dateOne, dateTwo)) $("#" + parseTimeObj(time)).removeClass("unfilled").addClass("filled").text(time.email.split("@")[0]);
    });
  });
});

function backWeek(){

}

function addWeek(){

}

function inWeek(timeObj, dateOne, dateTwo){
  var day = new Date(timeObj.day);

  return (day.getTime() >= dateOne.getTime() && day.getTime() <= dateTwo.getTime());
}

var timeStr = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"];
var dayStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseTimeObj(timeObj){
  var day = new Date(timeObj.day);
  var time = timeObj.time;

  var timeI = timeStr.indexOf(time);
  var dayI = day.getDay();

  return timeI * 7 + dayI;
}

function parseId(id) {
  var day = chrono.parseDate("This " + dayStr[id % 7]);
  if(new Date().getDay() == id % 7) day = chrono.parseDate("Today");

  var time = timeStr[Math.floor(id / 7)];

  return {
    day: day,
    time: time
  };
}

$(".unfilled").click(function(e) {
  if(e.target.classList.value.indexOf("unfilled") != -1){
    var timeObj = parseId(e.target.id);
    swal({
        title: "Almost there...",
        text: "Enter your Andover email:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "jdoe@andover.edu",
        allowOutsideClick: true,
        customClass: "popup",
        confirmButtonColor: "#4ea1d3",
        confirmButtonText: "Reserve Time"
      },
      function(inputValue) {
        if (inputValue === false) return false;
        var emailTest = new RegExp("^[a-zA-Z0-9]+@andover.edu$", "g");
        if (inputValue === "") {
          swal.showInputError("You need to write something!");
          return false;
        }
        else if(!emailTest.test(inputValue)){
          swal.showInputError("You must use a valid Andover email");
          return false;
        }

        var data = {
          email: inputValue,
          day: timeObj.day,
          time: timeObj.time
        };

        $.post("/savetime", data, function( data ) {
          window.location.pathname = "/reserve";
        })
        .fail(function(){
          swal("Oops!", "Something went wrong", "error");
        });
      });
  }
});
