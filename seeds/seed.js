const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
})

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price =  Math.floor(Math.random() * 30 + 10);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `https://picsum.photos/960/540`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nobis corporis ipsum explicabo neque quidem deserunt porro itaque ducimus a modi id, aut esse est dicta quam officia iure? Earum.",
            price: price
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});