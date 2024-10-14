const express = require('express')
const reviewsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const Middleware = require('../utils/Middleware')
const catchAsync = require('../utils/CatchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const Reviews = require('../controllers/reviews')

reviewsRouter.post('/',Middleware.login, Validation.review, catchAsync(Reviews.addReview))

reviewsRouter.delete('/:reviewId', Middleware.login, Middleware.isReviewAuthor, catchAsync(Reviews.deleteReview))

module.exports = reviewsRouter