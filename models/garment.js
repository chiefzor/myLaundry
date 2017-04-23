var mongoose = require("mongoose");

var garmentSchema = new mongoose.Schema({
   name: String,
   image: String,
   type: String,
   color: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Garment", garmentSchema);