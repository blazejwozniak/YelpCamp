var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override"); 
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var flash = require("connect-flash");

//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp");

var campgrounds = [
    {name: "Yahoo Camp", image: "https://www.platbos.co.za/images/IMG_4207-001.jpg"},
    {name: "Google Camp", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPaKjFSmK61AzjZ5aovb4OopW1h39iQkSGEXka2l4-FJI7wT3D"},
    {name: "Arizona Camp", image: "https://www.cabelas.com/content/dam/assets/AreasOfPassion/CampCabelas/Home/home_categories_techniques.jpg"}
]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
    secret: "BW secret key",
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
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app .listen(3000, function(){
    console.log("YelpCamp Server is running!")
});