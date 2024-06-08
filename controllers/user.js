const User = require("../models/User")
const ExpressError  = require("../utils/ExpressError")

module.exports.getRegForm = (req,res)=>{
    res.render("user/register")
}

module.exports.registerUser = async(req,res)=>{
    try{
    const {email,username, password} = req.body
    const user = new User({email,username})
    const registeredUser = await User.register(user,password)
    req.login(registeredUser,(err)=>{
        if(err)return next(err)
            req.flash("success","Welcome to campground")
        res.redirect("/campgrounds")
    })
}catch(e){ 
    req.flash("error",e.message)
    res.redirect("/register")
  

   
}}

module.exports.getLogForm = (req,res)=>{
    res.render("user/login")
}

module.exports.loginUser = (req,res)=>{
    req.flash("success","Welcome back!")
    const redirectUrl = res.locals.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logOut = (req,res)=>{
    req.logout((err)=>{
        if(err)return next(err)
            req.flash("success","successfully logged out")
        res.redirect("/campgrounds")
    })
    
}