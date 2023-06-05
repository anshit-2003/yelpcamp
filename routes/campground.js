const express = require("express");
const multer = require("multer");
const { isAuth, validatecamp, isAuthor } = require("../utils/campMiddleware");
const campground = require("../controllers/campground");
const router = express.Router();
const {storage} = require("../utils/cloudinary")
const upload = multer({storage})

router.route("/")
    .get(campground.index)
    .post(isAuth, upload.array('image'), validatecamp, campground.createCampground);

router.route("/new")
    .get( isAuth , campground.renderNewForm);

router.route("/:id")
    .get(campground.details)
    .put(isAuth, isAuthor, upload.array('image'), validatecamp, campground.update)
    .delete( isAuth, isAuthor, campground.destroy);

router.route("/:id/edit")
    .get(isAuth, isAuthor, campground.renderEditForm);


module.exports = router;
