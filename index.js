/*
  ANDOVER DTG PRINTING
  Jeffrey Shen
*/

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

mongoose.connect('mongodb://heroku_qcrtnbm1:sbm0vn526gdri0ssdsekoqgj3v@ds111549.mlab.com:11549/heroku_qcrtnbm1');
//mongoose.connect('mongodb://localhost/adtg');
var TimeSlot = require('./app/models/Slot');

var app = express();

//Middleware
app.use(express.static("./public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('1337 cookies'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//Pug
app.set('views', './views');
app.set('view engine', 'pug');

//Routes
app.get("/", function(req, res){
  res.render("index");
});

app.get("/resources", function(req, res){
  res.render("resources");
});

app.get("/archive", function(req, res){
  res.render("pastdesigns");
});

app.get("/reserve", function(req, res){
  res.render("calendar", {successMessage: req.flash('successMessage'), errorMessage: req.flash('errorMessage')});
});

app.get("/getTimeSlots", function(req, res, next){
  TimeSlot.find(function(err, slots){
    if(err) return next(err);
    res.json(slots);
  });
});

function testEmail(str){
  var re = /^[a-z0-9._%+-]+@andover.edu$/g;
  return re.test(str);
}

app.post("/savetime", function(req, res){
  TimeSlot.find({}, function(err, slots) {
    var included = false;
    slots.forEach(function(slot){
      if(slot.time == req.body.time && slot.day == req.body.day) {
        included = true;
      }
    });
    if(!included){

      var newSlot = new TimeSlot();

      if(!testEmail(req.body.email)){
        req.flash('errorMessage', 'Enter a valid Andover email');
        res.redirect("/reserve");
      }

      newSlot.email = req.body.email;
      newSlot.day = req.body.day;
      newSlot.time = req.body.time;

      newSlot.save(function (err) {
        if(err) req.flash('errorMessage', 'Oops! Something went wrong');
        else req.flash('successMessage', 'Time slot successfully reserved');
      });

      res.redirect("/reserve");
    }
    res.redirect("/reserve");
  });
});

//Startup
app.listen(process.env.PORT || 3000);

module.exports = app;
