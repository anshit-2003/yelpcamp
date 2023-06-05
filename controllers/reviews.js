const Review = require("../Modals/reviews")
const Campground = require("../Modals/campground")
const catchAsync = require("../utils/catchAsync");

module.exports.submitReview = catchAsync(async(req,res)=>{
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash("success","Review Added!")
    res.redirect(`/campgrounds/${camp._id}`)
})

module.exports.delete = catchAsync(async(req,res,next)=>{
    const{id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews : reviewId}})
    req.flash("success","Successfully Deleted Review!")
    res.redirect(`/campgrounds/${id}`)
})