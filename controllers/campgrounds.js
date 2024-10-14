const Campground = require('../models/campground')

const Campgrounds = {
    findAll: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds: campgrounds})
    },

    renderNewForm: (req, res) => {
        res.render('campgrounds/new');    
    },

    makeNewCampground: async(req, res, next) => {
        const newCampground = new Campground(req.body.campground)
        newCampground.author = req.user._id
        console.log(newCampground)
        await newCampground.save()
        req.flash('success', 'New Campground Created!')
        res.redirect(`campgrounds/${newCampground._id}`)
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