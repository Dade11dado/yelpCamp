const CampGround = require("../models/CampGround")
const Reviews = require("../models/Reviews")
const {reviewSchema,campgroundSchema} = require("../schemas")
const ExpressError = require("../utils/ExpressError")

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error","You must be signed in to access that page")
        return res.redirect("/login")
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req,res,next) =>{
    const {id} = req.params
    const cg = await CampGround.findById(id)
       if(!cg.author._id.equals(req.user._id)){
           req.flash("error","You do not have permission to do that")
           return res.redirect(`/campgrounds/${id}`)
       }
       next()
   }

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.validateCampground = (req,res,next) =>{
   
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.isReviewAuthor = () =>{
    const {id,reviewId} = req.params
    const review = Reviews.findById(reviewId)
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You cannot delete that review")
        return res.redirect(`/campgorunds/${id}`)
    }
    next()
}