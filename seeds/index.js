const mongoose = require("mongoose")
const Campground = require("../models/CampGround")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp")

const db = mongoose.connection
db.on("error",()=>{console.error.bind("an error occured with mongoose")})
db.once("open",()=>{
    console.log("connected to database")
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDb = async () =>{
    await Campground.deleteMany({})
    for (let i  =0;i<200;i++){
        let random100 = Math.floor(Math.random()*100)
        const camp = new Campground({
            author:"66563149df4f2be894cc3ca9",
        location:`${cities[random100].city}, ${cities[random100].state}`,
           title: `${sample(descriptors)} ${sample(places)}`,
           image:[
            {
              url: 'https://res.cloudinary.com/dbdtobwer/image/upload/v1717162082/YelpCamp/jglvxbdc3avw4ls6bqz5.png',
              filename: 'YelpCamp/jglvxbdc3avw4ls6bqz5',
            },
            {
              url: 'https://res.cloudinary.com/dbdtobwer/image/upload/v1717162083/YelpCamp/tmjnn7ornycwh6yztotj.png',
              filename: 'YelpCamp/tmjnn7ornycwh6yztotj',
            }
          ],
           description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo reiciendis sequi laudantium, molestias obcaecati assumenda. Saepe eveniet quas perspiciatis modi quasi delectus! Accusantium quidem quam, minima itaque veniam obcaecati commodi.",
           price:Math.floor(Math.random()*3000),
           geometry:{ type: 'Point', coordinates: [ 
            cities[random100].longitude, 
            cities[random100].latitude ] 
          }
        })
        console.log(camp.geometry)
        await camp.save()
    }
}

seedDb()
.then(()=>{
    mongoose.connection.close()
})