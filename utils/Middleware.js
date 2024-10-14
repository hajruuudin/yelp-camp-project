const Campground = require('../models/campground')
const Review = require('../models/review')

const Middleware = {
    login: (req, res, next) => {
        if(!req.isAuthenticated()){
            req.session.returnTo = req.originalUrl
            return res.redirect('/login')
        }
        next()
    },
    storeReturnTo: (req, res, next) => {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    },
    isAuthor: async (req, res, next) => {
        const { id } = req.params
        const campground = await Campground.findById(id)
        if(!campground.author.equals(req.user._id)){
            req.flash('error', 'You do not have permission for this request!')
            return res.redirect(`/campgrounds/${id}`)
        }
        next()
    },
    isReviewAuthor: async (req, res, next) => {
        const { id, reviewId } = req.params
        const review = await Review.findById(reviewId)
        if(!review.author.equals(req.user._id)){
            req.flash('error', 'You do not have permission for this request!')
            return res.redirect(`/campgrounds/${id}`)
        }
        next()
    }
}


module.exports = Middleware;