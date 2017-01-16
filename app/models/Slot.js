var mongoose = require("mongoose");

var SlotSchema = new mongoose.Schema({
  email: String,
  time: String,
  day: String
});

var Slot = mongoose.model("Slot", SlotSchema);

module.exports = Slot;
