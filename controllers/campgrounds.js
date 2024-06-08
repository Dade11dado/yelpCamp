const Campground = require("../models/CampGround")
const ExpressError = require("../utils/ExpressError")
const useSpinner = require("use-spinner")
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({accessToken:mapboxToken})

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", {campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req,res,next)=>{
    if(!req.body.campground) throw new ExpressError("Invalid campground data", 400)
        const campground = new Campground(req.body.campground)
        campground.image = req.files.map(f=>({url:f.path,filename:f.filename}))
        campground.author = req.user._id
        await campground.save()
        console.log(campground)
        req.flash("success","Successfully made a new campground")
        res.redirect(`/campgrounds/${campground._id}`)
   
}

module.exports.deleteCampgorund = async (req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success","Succesfully deleted the campground")
    res.redirect("/campgrounds")
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const images = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.image.push(...images)
    await campground.save()
    if(req.body.deleteImages){
        for(let i of req.body.deleteImages){
            await cloudinary.uploader.destroy(i)
        }
        console.log(req.body.deleteImages)
        await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash("success","succesfully updated your campground")
    res.redirect(`/campgrounds/${campground._id}`)

}


module.exports.showCampground = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate(
        {path:"reviews",
            populate:{
                path:"author"
            }
        }).populate("author")
    console.log(campground)
    if(!campground){
        req.flash("error","Can't find that campgorund, sorry")
        res.redirect("/campgrounds")
    }
    const avg = campground.reviews.length>0
    ?(Math.floor(campground.reviews.reduce((acc, initial)=>{
       return acc += initial.rating},0)/campground.reviews.length))
    :"-"
    res.render("campgrounds/show", {campground,avg})

    
}

module.exports.getEditCampground = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash("error","Cannot find that campgorund")
        return res.redirect("/campgrounds")
    }

    res.render("campgrounds/edit",{campground})
}