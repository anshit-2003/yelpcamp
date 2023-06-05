const express = require("express")
const router = express.Router({mergeParams : true})
const review = require("../controllers/reviews")
const {isAuth} = require("../utils/campMiddleware")
const {validatereview, isAuthor} = require("../utils/reviewMiddleware")


router.route("/")
    .post(isAuth, validatereview, review.submitReview)

router.route("/:reviewId")
    .delete(isAuthor, review.delete)


module.exports = router