const {campgroundSchema, reviewSchema} = require('../schemas')
const ExpressError = require('./ExpressError')

const Validation = {
    campground: (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);

        if ( error ) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    },
    review: (req, res, next) => {
        const { error } = reviewSchema.validate(req.body)

        if ( error ) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    }
}


module.exports = Validation;