const mongoose = require("mongoose");
const Review = require("./reviews")
const schema = mongoose.Schema;
const opts = {toJSON: {virtuals : true}}

const ImageSchema = new schema({
    url : String,
    filename : String
})

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
})

const CampgroundSchema = new schema({
    title : String,
    images : [ImageSchema],
    price : Number,
    description : String,
    location : String,
    author : {
        type: schema.Types.ObjectId,
        ref: "User"
    },
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }

}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,30)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
         await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
         })
    }

})

module.exports = mongoose.model("Campground",CampgroundSchema)