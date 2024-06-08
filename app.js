//imports
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError")
const campgroundRouter = require("./routes/campgrounds")
const reviewsRouter = require("./routes/reviews")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/User")
const userRouter = require("./routes/user")
//initializing express
const app = express()

const MongoDBStore = require("connect-mongo")

const db_url = process.env.MONGOOSE_URL
//initializing database
mongoose.connect(db_url)
const db = mongoose.connection
db.on("error",()=>{console.error.bind("an error occured with mongoose")})
db.once("open",()=>{
    console.log("connected to database")
})

//setting the middleware
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")))

const store = MongoDBStore.create({
    mongoUrl:db_url,
    touchAfter: 24*3600,
    crypto:{
        secret:"thisshouldbeabettersecret",
    }
   
})

store.on("error",(e)=>{
    console.log("Store error",e)
})
const sessionConfig = {
    store,
    secret:"thisshouldbeabettersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    console.log(res.locals.currentUser)
    next()
})

//setting the routes
app.use("/campgrounds",campgroundRouter)
app.use("/campgrounds/:id/reviews",reviewsRouter)
app.use("/",userRouter)

//handling basic routes
app.get("/",(req,res)=>{
    res.render("home")
})

//404 error
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found!",404))
})

//error handler
app.use((err,req,res,next)=>{
    const {statusCode=500} = err
    if(!err.message) err.message="Something went wrong!"
    res.status(statusCode).render("error",{err})
})

//listening to port 3000
app.listen(3000,()=>{
    console.log("connected to port 3000")
})