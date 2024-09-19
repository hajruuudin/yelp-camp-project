const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
})

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home')
})


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: campgrounds})
})

// TO DO FINISH THIS
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: campgrounds})
})


app.listen('8080', () => {
    console.log("YelpCamp App listening on 8080");
})