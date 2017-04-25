var express = require("express");
var router  = express.Router();
var Garment = require("../models/garment");
var middleware = require("../middleware");


//INDEX - show all garments
router.get("/", function(req, res){
    // Get all garments from DB
    Garment.find({}, function(err, allCollection){
       if(err){
           console.log(err);
       } else {
          res.render("collection/index",{collection:allCollection});
       }
    });
});

//CREATE - add new garment to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to garments array
    console.log(req.body);
    var name = req.body.name;
    var image = req.body.image;
    var color = req.body.color;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGarment = {name: name, image: image, color: color, description: desc, author:author}
    // Create a new garment and save to DB
    Garment.create(newGarment, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to garments page
            console.log(newlyCreated);
            res.redirect("/collection");
        }
    });
});

//NEW - show form to create new garment
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("collection/new"); 
});

// SHOW - shows more info about one garment
router.get("/:id", function(req, res){
    //find the garment with provided ID
    Garment.findById(req.params.id).populate("comments").exec(function(err, foundGarment){
        if(err){
            console.log(err);
        } else {
            console.log(foundGarment)
            //render show template with that garment
            res.render("collection/show", {garment: foundGarment});
        }
    });
});

// EDIT GARMENT ROUTE
router.get("/:id/edit", middleware.checkGarmentOwnership, function(req, res){
    Garment.findById(req.params.id, function(err, foundGarment){
        res.render("collection/edit", {garment: foundGarment});
    });
});

// UPDATE GARMENT ROUTE
router.put("/:id",middleware.checkGarmentOwnership, function(req, res){
    // find and update the correct garment
    Garment.findByIdAndUpdate(req.params.id, req.body.garment, function(err, updatedGarment){
       if(err){
           res.redirect("/collection");
       } else {
           //redirect somewhere(show page)
           res.redirect("/collection/" + req.params.id);
       }
    });
});

// DESTROY GARMENT ROUTE
router.delete("/:id",middleware.checkGarmentOwnership, function(req, res){
   Garment.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/collection");
      } else {
          res.redirect("/collection");
      }
   });
});


module.exports = router;

