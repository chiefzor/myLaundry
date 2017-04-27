var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
   name: String,
   path: String
});

module.exports = mongoose.model("Image", imageSchema);