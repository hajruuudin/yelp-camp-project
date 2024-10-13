const express = require('express')
const campgroundsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const catchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const Middleware = require('../utils/Middleware')

campgroundsRouter.get('/', catchAsync (async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: campgrounds})
}))

campgroundsRouter.get('/new', Middleware.login, (req, res) => {
    res.render('campgrounds/new');    
})


campgroundsRouter.post('/', Validation.campground, Middleware.login, catchAsync(async(req, res, next) => {
    const newCampground = new Campground(req.body.campground)
    console.log(newCampground)
    await newCampground.save()
    req.flash('sucess', 'New Campground Created!')
    res.redirect(`campgrounds/${newCampground._id}`)
}))

campgroundsRouter.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    console.log(campground)
    res.render('campgrounds/show', {campground: campground})
}))

campgroundsRouter.get('/:id/edit',Middleware.login, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp : campground})
}))

campgroundsRouter.put('/:id', Validation.campground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('sucess', 'Campground Edited!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

campgroundsRouter.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('sucess', 'Campground Deleted!')
    res.redirect('/campgrounds')
}))

module.exports = campgroundsRouter;