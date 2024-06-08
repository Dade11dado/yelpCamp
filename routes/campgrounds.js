const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const {isLoggedIn,isAuthor,validateCampground} = require("../utils/middleware")
const campgrounds = require("../controllers/campgrounds")
const multer = require("multer")
const {storage} = require("../cloudinary/index")
const upload = multer({storage})

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.any(),validateCampground,catchAsync(campgrounds.createCampground))
    // .post(upload.array("image"),(req,res)=>{
    //     console.log(req.file)
    //     res.send("done it ")})

router.get("/new",isLoggedIn,campgrounds.renderNewForm)

router.route("/:id")
    .put(isLoggedIn,isAuthor,upload.any(),validateCampground,catchAsync(campgrounds.updateCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampgorund))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.getEditCampground))

module.exports = router