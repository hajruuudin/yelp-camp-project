const express = require('express')
const reviewsRouter = express.Router({mergeParams: true});
const Validation = require('../utils/Validation')
const Middleware = require('../utils/Middleware')
const catchAsync = require('../utils/CatchAsync')
const Reviews = require('../controllers/reviews')

/**
 * POST /campgrounds/:id/reviews
 * @function
 * @async
 * @memberof module:routes/reviews
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
reviewsRouter.post('/', Middleware.login, Validation.review, catchAsync(Reviews.addReview));

/**
 * DELETE /campgrounds/:id/reviews/:reviewId
 * @function
 * @async
 * @memberof module:routes/reviews
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
reviewsRouter.delete('/:reviewId', Middleware.login, Middleware.isReviewAuthor, catchAsync(Reviews.deleteReview));

module.exports = reviewsRouter