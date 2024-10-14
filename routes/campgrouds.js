const express = require('express')
const campgroundsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const catchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const Middleware = require('../utils/Middleware')
const Campgrounds = require('../controllers/campgrounds')


campgroundsRouter.route('/')
    .get(catchAsync (Campgrounds.findAll))
    .post(Validation.campground, Middleware.login, catchAsync(Campgrounds.makeNewCampground))

campgroundsRouter.get('/new', Middleware.login, Campgrounds.renderNewForm)

campgroundsRouter.route('/:id')
    .get(catchAsync(Campgrounds.findById))
    .put(Middleware.login, Middleware.isAuthor, Validation.campground, catchAsync(Campgrounds.editCampground))
    .delete(Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.deleteCampground))

campgroundsRouter.get('/:id/edit',Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.renderEditForm))


module.exports = campgroundsRouter;