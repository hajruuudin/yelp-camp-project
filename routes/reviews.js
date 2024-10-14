const express = require('express')
const reviewsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const Middleware = require('../utils/Middleware')
const catchAsync = require('../utils/CatchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')

reviewsRouter.post('/',Middleware.login, Validation.review, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created')
    res.redirect(`/campgrounds/${campground._id}`)
}))

reviewsRouter.delete('/:reviewId',Middleware.login, Middleware.isReviewAuthor, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews : reviewId } } )
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = reviewsRouter