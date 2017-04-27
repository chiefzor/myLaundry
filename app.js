var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Garment  = require("./models/garment"),
    User        = require("./models/user")
    
//requiring routes
var collectionRoutes = require("./routes/collection"),
    indexRoutes      = require("./routes/index")
 
var url = process.env.DBURL || "mongodb://localhost/myLaundryV1";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "myLaundry app r0ck$!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/collection", collectionRoutes);
//seedDB();
/*app.use(logErrors);
app.use(errorHandler);

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}*/
function seedDB(){
   //Remove all campgrounds
   Garment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
    }); 
    //add a few comments
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("myLaundry Server Has Started!");
});