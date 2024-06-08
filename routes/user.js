const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const {storeReturnTo} = require("../utils/middleware")
const user = require("../controllers/user")

router.route("/register")
    .get(user.getRegForm)
    .post(catchAsync(user.registerUser))

router.route("/login")
    .get(user.getLogForm)
    .post(storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),user.loginUser)

router.get("/logout",user.logOut)

module.exports = router