if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbtoken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mbtoken})
const Middleware = require('../utils/Middleware')

const Campgrounds = {
    findAll: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', 
            {
                campgrounds: campgrounds, 
                message: `Search all campgrounds:`,
                result: true
            })
    },

    renderNewForm: (req, res) => {
        res.render('campgrounds/new');    
    },

    makeNewCampground: async (req, res, next) => {
        console.log(req.body.campground.location)
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()

        const imageUrls = [];
        console.log(req.body.campground)

        for (const file of req.files) {
            const imageUrl = await Middleware.uploadImageToImgbb(file.buffer, file.originalname);
            imageUrls.push(imageUrl);
        }
        
        const newCampground = new Campground({
            title: req.body.campground.title,
            images: imageUrls,
            location: req.body.campground.location,
            description: req.body.campground.description,
            price: req.body.campground.price,
            author: req.user._id,
            geometry: geoData.body.features[0].geometry
        })

        console.log(newCampground)
        await newCampground.save()
        req.flash('sucess', 'New Campground Added!')
        res.redirect(`/campgrounds/${newCampground._id}`)
    },

    findById: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        res.render('campgrounds/show', {campground: campground})
    },
    findByFilter: async(req, res) => {
        const searchParameter = req.query.search;
        const campgrounds = await Campground.find({title: {$regex: new RegExp(searchParameter, 'i')}})
        if(campgrounds.length === 0){
            res.render('campgrounds/index',
                {   
                    campgrounds: campgrounds, 
                    message: `Showing results for: ${searchParameter}`, 
                    result: false
                })
        } else {
            res.render('campgrounds/index', 
                {
                    campgrounds: campgrounds, 
                    message: `Showing results for: ${searchParameter}`,
                    result: true
                })
        }
    },
    renderEditForm: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id)
        if(!campground){
            req.flash('error', 'Campground does not exist')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/edit', {camp: campground})
    },

    editCampground: async(req, res) => {
        const { id } = req.params;
        console.log(req.body)
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{ new: true })
        console.log(campground)
        req.flash('success', 'Campground Edited!')
        res.redirect(`/campgrounds/${campground._id}`)
    },

    deleteCampground: async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Campground Deleted!')
        res.redirect('/campgrounds')
    }
}

module.exports = Campgrounds