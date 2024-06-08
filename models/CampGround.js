const mongoose = require("mongoose");
const Reviews = require("./Reviews");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url:String,
    filename:String
})

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
})
const opts = {toJSON:{virtuals:true}}
const campGroundSchema = new Schema({
    title:String,
    image:[imageSchema],
    geometry:{
        type:{
            type:String,
            enum:["Point"]
        },
        coordinates:{
            type:[Number],
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:"Reviews"
    }]
},opts)

campGroundSchema.post("findOneAndDelete",async (doc)=>{
   if(doc){
    await Reviews.deleteMany({
        _id:{
            $in: doc.reviews }
    })
   }
})

campGroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,30)}...</p>`
})

module.exports = mongoose.model("Campground",campGroundSchema)