if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const campgroundsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const catchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const Middleware = require('../utils/Middleware')
const Campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const imgbbUploader = require('imgbb-uploader');

const storage = multer.memoryStorage()
const upload = multer({storage})


campgroundsRouter.route('/')
    .get(catchAsync (Campgrounds.findAll))
    .post(Middleware.login, upload.array('image'), catchAsync(Campgrounds.makeNewCampground))
    

campgroundsRouter.get('/search', Campgrounds.findByFilter)

campgroundsRouter.get('/new', Middleware.login, Campgrounds.renderNewForm)

campgroundsRouter.route('/:id')
    .get(catchAsync(Campgrounds.findById))
    .put(Middleware.login, Middleware.isAuthor, Validation.campground, catchAsync(Campgrounds.editCampground))
    .delete(Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.deleteCampground))

campgroundsRouter.get('/:id/edit',Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.renderEditForm))


module.exports = campgroundsRouter;