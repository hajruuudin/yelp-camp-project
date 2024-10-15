if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const sharp = require('sharp')

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
            const image = sharp(imageBuffer)
            const metadata = await image.metadata()
            let compressedImage;

            if (metadata.format === 'jpeg') {
                compressedImage = await image.jpeg({ quality: 40 }).toBuffer();
            } else if (metadata.format === 'png') {
                compressedImage = await image.png({ quality: 40, compressionLevel: 8 }).toBuffer();
            } else if (metadata.format === 'webp') {
                compressedImage = await image.webp({ quality: 40 }).toBuffer();
            } else {
                throw new Error('Unsupported image format');
            }

            const response = await imgbbUploader({
                apiKey: process.env.IMGBB_API_KEY,
                base64string: compressedImage.toString('base64'),
                name: originalname.split('.')[0],
            });

            return response.url;
        } catch (error) {
            throw new Error('Failed to upload image to Imgbb');
        }
    }
}


module.exports = Middleware;