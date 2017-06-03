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
var chrono = require('chrono-node');
var fs = require('fs');
var email = require('./app/mailer.js');

var uri = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/adtg';

mongoose.connect(uri, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uri + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uri);
  }
});

var Slot = require('./app/models/Slot');

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

app.get("/faqs", function(req, res){
  res.render("faqs");
});

app.get("/contact", function(req, res){
  res.render("contact");
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
  Slot.find(function(err, slots){
    if(err) return next(err);

    res.json(slots);
  });
});

app.get("/livecounter", function(req, res){
  res.render("livecounter");
});


function testEmail(str){
  return fs.readFileSync('pdf_parser/content.txt').includes(str);
}

app.post("/savetime", function(req, res){
  Slot.find({}, function(err, slots) {
    var included = false;
    slots.forEach(function(slot){
      if(slot.time == req.body.time && slot.day == req.body.day) {
        included = true;
      }
    });
    if(!included){

      var newSlot = new Slot();

      if(!testEmail(req.body.email)){
        req.flash('errorMessage', 'Enter a valid Andover email');
        res.redirect("/reserve");
      }
      else{
        newSlot.email = req.body.email;
        newSlot.day = req.body.day;
        newSlot.time = req.body.time;

        newSlot.save(function (err) {
          if(err) req.flash('errorMessage', 'Oops! Something went wrong');
          else req.flash('successMessage', 'Time slot successfully reserved');
          var date = new Date(req.body.day);
          email.send(req.body.email, req.body.time, (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
          res.redirect("/reserve");
        });
      }
    }
  });
});

//Startup
app.listen(process.env.PORT || 3000);

module.exports = app;
