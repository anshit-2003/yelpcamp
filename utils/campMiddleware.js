const { campgroundSchema} = require("../Joi_schemas");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../Modals/campground");


module.exports.isAuth = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You need to be Signed In!")
        return res.redirect("/login")
    }
    next();

}

module.exports.validatecamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = catchAsync(async(req,res,next)=>{
    const { id } = req.params;
        const camp = await Campground.findById(id)
        if(!camp.author.equals(req.user._id)){
            req.flash("error","Access Denied No Permission!")
            return res.redirect(`/campgrounds/${id}`)
        }
        next()
    })