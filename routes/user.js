const express = require("express");
const user = require("../controllers/users")
const passport = require("passport")
const router = express.Router();

router.route("/")
    .get(user.renderHome)

router.route("/register")
    .get(user.renderRegisterFrom)
    .post(user.register);

    

router.route("/login")
    .get(user.renderLoginForm)
    .post(passport.authenticate ("local",{failureFlash :true, failureRedirect :"/login" }),
    user.login)



router.get("/logout", user.logout)

module.exports = router;
