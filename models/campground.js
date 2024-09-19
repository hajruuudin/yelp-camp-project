const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundShema = new Schema({
    title: String,
    price: String,
    escription: String,
    location: String
});

module.exports = mongoose.model('Campground', campgroundShema);