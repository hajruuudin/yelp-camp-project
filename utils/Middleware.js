if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const Campground = require('../models/campground')
const Review = require('../models/review')
const imgbbUploader = require('imgbb-uploader')



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
    },

    uploadImageToImgbb: async (imageBuffer, originalname) => {
        try {
            const response = await imgbbUploader({
                apiKey: process.env.IMGBB_API_KEY,  // Get the API key from .env
                base64string: imageBuffer.toString('base64'),  // Convert image buffer to base64
                name: originalname.split('.')[0],  // Optional: Use the original filename
            });
            return response.url;  // Return the URL of the uploaded image
        } catch (error) {
            throw new Error('Failed to upload image to Imgbb');
        }
    }
}


module.exports = Middleware;