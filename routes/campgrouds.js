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
    // .post(Validation.campground, Middleware.login, catchAsync(Campgrounds.makeNewCampground))
    .post(Middleware.login, upload.array('image'), async (req, res) => {
        const imageUrls = [];

        for (const file of req.files) {
            const imageUrl = await Middleware.uploadImageToImgbb(file.buffer, file.originalname);
            imageUrls.push(imageUrl);  // Store the image URL in an array
        }
        
        const newCampground = new Campground({
            title: req.body.campground.title,
            images: imageUrls,
            location: req.body.campground.location,
            description: req.body.campground.description,
            price: req.body.campground.price,
            author: req.user._id
        })

        console.log(newCampground)
        await newCampground.save()
        req.flash('sucess', 'New Campground Added!')
        res.redirect(`/campgrounds/${newCampground._id}`)
    })

campgroundsRouter.get('/new', Middleware.login, Campgrounds.renderNewForm)

campgroundsRouter.route('/:id')
    .get(catchAsync(Campgrounds.findById))
    .put(Middleware.login, Middleware.isAuthor, Validation.campground, catchAsync(Campgrounds.editCampground))
    .delete(Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.deleteCampground))

campgroundsRouter.get('/:id/edit',Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.renderEditForm))


module.exports = campgroundsRouter;