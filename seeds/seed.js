/**
 * Seeding file: Use this file to seed the database. IMPORTANT: Seeding will not work by default
 * as there is an author object inside the database. Before seeding. do the following:
 * - Start the server to create the database
 * - Create at least one account and find the _id attribute in the mongo database
 * - Replace the author object here in the seed with the given _id attribute
 * This will make sure that the data doesn't break, as every campsite needs to have an author
 */
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
    for(let i = 0; i < 500; i++){
        const randomDescription = Math.floor(Math.random() * 10);
        const randomImages = Math.floor(Math.random() * 8)
        const random1000 = Math.floor(Math.random() * 889);
        const price =  Math.floor(Math.random() * 30 + 10);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '670cef3b1035b396c5675e22', // REPLACE THIS WITH ACTUAL _id OF AN EXISITNG USER
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