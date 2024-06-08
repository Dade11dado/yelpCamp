const Campground = require("../models/CampGround")
const Reviews = require("../models/Reviews")
const ExpressError = require("../utils/ExpressError")

module.exports.createReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Reviews(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Succesfully created new review")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {reviewId, id} = req.params
    Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash("success","Succesfully deleted the review")
    res.redirect(`/campgrounds/${id}`)
}