if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbtoken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mbtoken})
const Middleware = require('../utils/Middleware')

const Campgrounds = {
    /**
     * Retrieves all campgrounds and renders the index view.
     * @async
     * @function findAll
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Renders the campgrounds index view with a list of all campgrounds.
     */
    findAll: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', 
            {
                campgrounds: campgrounds, 
                message: `Search all campgrounds:`,
                result: true
            });
    },

    /**
     * Renders the form for creating a new campground.
     * @function renderNewForm
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Renders the new campground form.
     */
    renderNewForm: (req, res) => {
        res.render('campgrounds/new');    
    },

    /**
     * Creates a new campground and saves it to the database.
     * @async
     * @function makeNewCampground
     * @param {Object} req - The request object containing campground data.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>} Redirects to the newly created campground's page.
     */
    makeNewCampground: async (req, res, next) => {
        console.log(req.body.campground.location);
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();

        const imageUrls = [];
        console.log(req.body.campground);

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
        });

        console.log(newCampground);
        await newCampground.save();
        req.flash('success', 'New Campground Added!');
        res.redirect(`/campgrounds/${newCampground._id}`);
    },

    /**
     * Retrieves a campground by its ID and renders the show view.
     * @async
     * @function findById
     * @param {Object} req - The request object containing the campground ID.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Renders the show view for the campground.
     */
    findById: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        res.render('campgrounds/show', {campground: campground});
    },

    /**
     * Searches for campgrounds by title based on a query parameter.
     * @async
     * @function findByFilter
     * @param {Object} req - The request object containing the search query.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Renders the index view with search results.
     */
    findByFilter: async(req, res) => {
        const searchParameter = req.query.search;
        const campgrounds = await Campground.find({title: {$regex: new RegExp(searchParameter, 'i')}});
        if(campgrounds.length === 0){
            res.render('campgrounds/index',
                {   
                    campgrounds: campgrounds, 
                    message: `Showing results for: ${searchParameter}`, 
                    result: false
                });
        } else {
            res.render('campgrounds/index', 
                {
                    campgrounds: campgrounds, 
                    message: `Showing results for: ${searchParameter}`,
                    result: true
                });
        }
    },

    /**
     * Renders the edit form for an existing campground.
     * @async
     * @function renderEditForm
     * @param {Object} req - The request object containing the campground ID.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Renders the edit form for the specified campground.
     */
    renderEditForm: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if(!campground){
            req.flash('error', 'Campground does not exist');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', {camp: campground});
    },

    /**
     * Edits an existing campground's information.
     * @async
     * @function editCampground
     * @param {Object} req - The request object containing the campground ID and updated data.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Redirects to the edited campground's page.
     */
    editCampground: async(req, res) => {
        const { id } = req.params;
        console.log(req.body);
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
        console.log(campground);
        req.flash('success', 'Campground Edited!');
        res.redirect(`/campgrounds/${campground._id}`);
    },

    /**
     * Deletes a campground by its ID.
     * @async
     * @function deleteCampground
     * @param {Object} req - The request object containing the campground ID.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Redirects to the campgrounds index page.
     */
    deleteCampground: async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Campground Deleted!');
        res.redirect('/campgrounds');
    }
}

module.exports = Campgrounds;