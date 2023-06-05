const ExpressError = require("../utils/error");
const Review = require("../Modals/reviews")
const catchAsync = require("../utils/catchAsync");
const {reviewSchema} = require("../Joi_schemas")


module.exports.validatereview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else{
        next()
    }
}

module.exports.isAuthor = catchAsync(async(req,res,next)=>{
    const { id , reviewId } = req.params;
        const review = await Review.findById(reviewId)
        if(!review.author.equals(req.user._id)){
            req.flash("error","Access Denied No Permission!")
            return res.redirect(`/campgrounds/${id}`)
        }
        next()
 })