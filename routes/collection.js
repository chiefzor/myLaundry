var express = require("express");
var router  = express.Router();
var multer  = require('multer');
var path    = require('path');
var crypto  = require('crypto');
var mime    = require('mime-types');
var diskDestination = 'public/uploads/';
var fileName = null;
var storage =   multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err){
           return cb(err);
          }
        else{
          cb(null, fileName = raw.toString('hex') + '.' + mime.extension(file.mimetype));
          console.log('filefromfunc: ' + fileName);
        }
    })
  }
});
var upload = multer({ storage : storage}).single('image');
/*var upload  = multer({ dest: diskDestination }).single('image');*/
var Garment = require("../models/garment");
var Image = require("../models/image");
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
    // uploads the file to the filesystem
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        else{
            // get data from form and add to garments array
            var newGarment = null;
            var name = req.body.name;
            var image = null;
            var color = req.body.color;
            var desc = req.body.description;
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            console.log('file: ' + fileName);
            console.log(req.body.image);
            image = {
                name: fileName,
                path: diskDestination + fileName
            }
            
            // Create a new garment and image and save to DB
            Image.create(image, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }
                else{
                    newGarment = {name: name, image: newlyCreated, color: color, description: desc, author:author};
                    console.log('newGarment: ' + Object.keys(newGarment));
                    console.log('Image: ' + Object.keys(newlyCreated));
                    Garment.create(newGarment, function(err, newlyCreated){
                        if(err){
                            console.log(err);
                        } else {
                            //redirect back to garments page
                            console.log('Garment: ' + Object.keys(newlyCreated));
                            res.redirect("/collection");
                        }
                    });
                }
                });
            
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
    Garment.findById(req.params.id).populate("image").exec(function(err, foundGarment){
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
        if(err){
           res.redirect("/collection");
       } else {
        res.render("collection/edit", {garment: foundGarment});
       }
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

router.get("/:id/public/uploads/:imageid", function(req, res){
    var file = path.resolve('./public/uploads/' + req.params.imageid);
    res.sendFile(file);
});


module.exports = router;

