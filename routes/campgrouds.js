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
    newCampground.author = req.user._id
    console.log(newCampground)
    await newCampground.save()
    req.flash('success', 'New Campground Created!')
    res.redirect(`campgrounds/${newCampground._id}`)
}))

campgroundsRouter.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('campgrounds/show', {campground: campground})
}))

campgroundsRouter.get('/:id/edit',Middleware.login, Middleware.isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {camp: campground})
}))

campgroundsRouter.put('/:id',Middleware.login, Middleware.isAuthor, Validation.campground, catchAsync(async(req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{ new: true })
    console.log(campground)
    req.flash('success', 'Campground Edited!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

campgroundsRouter.delete('/:id',Middleware.login, Middleware.isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted!')
    res.redirect('/campgrounds')
}))

module.exports = campgroundsRouter;