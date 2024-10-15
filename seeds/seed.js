const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors, campgroundDescriptions, images} = require('./seedHelper')
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
        const randomDescription = Math.floor(Math.random() * 10);
        const randomImages = Math.floor(Math.random() * 8)
        const random1000 = Math.floor(Math.random() * 1000);
        const price =  Math.floor(Math.random() * 30 + 10);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '670cef3b1035b396c5675e22',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: images[randomImages],
            description: campgroundDescriptions[randomDescription],
            price: price
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});