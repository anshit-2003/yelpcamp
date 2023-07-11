if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const expressError = require("./utils/error");
const campgrounds = require("./routes/campground");
const flash = require("connect-flash")
const reviews = require("./routes/reviews");
const ejsmate = require("ejs-mate");
const userroutes = require("./routes/user")
const methodOverride = require("method-override");
const passport = require("passport")
const passport_local = require("passport-local")
const user = require("./Modals/users")
const MongoStore = require('connect-mongo');
const dburl = process.env.DB_URL;

const port = process.env.PORT || 8080;

// Database Connection
const connectdb = async()=>{
    try{
        const conn = await mongoose.connect(dburl);
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit(1) 
    }
}

const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

//Creating App
const app = express();

//App Configuration
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname,"public"))

//Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))


// Session & Flash
const sessionconfig = {
    store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        name : "bleh",
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        HttpOnly : true,
        // secure : true
    }
}
app.use(session(sessionconfig))
app.use(flash())

//Passport Config
app.use(passport.initialize())
app.use(passport.session());
passport.use(new passport_local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//Session Locals
app.use((req,res,next)=>{
    res.locals.currentUser= req.user;
    res.locals.success =req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

//Routes
app.use("/", userroutes);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);


//Middleware
app.all("*", (req, res, next) => {
    next(new expressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statuscode).render("error", { err });
});


connectdb().then(()=>{
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });

})
