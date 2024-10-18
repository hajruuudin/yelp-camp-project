if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const Review = require('../models/review');
const Campground = require('../models/campground');

const Reviews = {
    /**
     * Adds a new review to a campground.
     * @async
     * @function addReview
     * @param {Object} req - The request object containing the campground ID and review data.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Redirects to the campground's page with a success message.
     */
    addReview: async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Review created');
        res.redirect(`/campgrounds/${campground._id}`);
    },

    /**
     * Deletes a review from a campground.
     * @async
     * @function deleteReview
     * @param {Object} req - The request object containing the campground ID and review ID.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Redirects to the campground's page after the review is deleted.
     */
    deleteReview: async (req, res) => {
        const { id, reviewId } = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        res.redirect(`/campgrounds/${id}`);
    }
}

module.exports = Reviews;