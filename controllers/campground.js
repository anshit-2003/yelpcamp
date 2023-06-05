const catchAsync = require("../utils/catchAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken : mapBoxToken})
const {cloudinary} = require("..//utils/cloudinary")
const Campground = require("../Modals/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("Campgrounds/index", { campgrounds });
};

module.exports.createCampground = catchAsync(async (req, res) => {
   const geodata = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f=> ({url :f.path, filename: f.filename}))
    camp.geometry = geodata.body.features[0].geometry
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Succesfully Made Campground!");
    res.redirect(`/campgrounds/${camp._id}`);
});

module.exports.renderNewForm = (req, res) => {
    res.render("Campgrounds/new");
};

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("Campgrounds/edit", { camp });
});

module.exports.details = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!camp) {
        req.flash("error", "Campground Does Not Exist!");
        res.redirect("/campgrounds");
    }
    res.render("Campgrounds/details", { camp });
});

module.exports.update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f =>({url : f.path, filename : f.filename})) 
    camp.images.push(...imgs)
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull : {images: {filename : {$in : req.body.deleteImages }}}})
    }
    console.log(camp)
    req.flash("success", "Succesfully Updated Campground!");
    res.redirect(`${id}`);
});

module.exports.destroy = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Camp!");
    res.redirect("/campgrounds");
});
