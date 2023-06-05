const mongoose = require("mongoose")
const passport_local_mongoose = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }

});

UserSchema.plugin(passport_local_mongoose)

module.exports = mongoose.model("User",UserSchema)