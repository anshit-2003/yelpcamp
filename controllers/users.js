const catchAsync = require("../utils/catchAsync");
const User = require("../Modals/users");

module.exports.renderRegisterFrom = (req, res) => {
    res.render("users/register");
}

module.exports.renderHome = (req,res)=>{
    res.render("home")
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login")   
}

module.exports.login = (req,res)=>{
    req.flash("success","Successfully Logged In!")
    res.redirect("/campgrounds")

}

module.exports.logout = (req,res)=>{
    req.logout(function(err){
        if(err) return next(err);
    })
    req.flash("success","Logged Out!")
    res.redirect("/campgrounds")
}


module.exports.register = catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registereduser = await User.register(user, password);
        req.login(registereduser, err=>{
            if(err) return next(err)
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
})