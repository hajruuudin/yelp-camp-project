/**
 * @module routes/campgrounds
 * @requires express
 * @requires ../utils/Validation
 * @requires ../utils/CatchAsync
 * @requires ../models/campground
 * @requires ../utils/Middleware
 * @requires ../controllers/campgrounds
 * @requires multer
 * @requires imgbb-uploader
 */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const campgroundsRouter = express.Router({ mergeParams: true });
const Validation = require('../utils/Validation');
const catchAsync = require('../utils/CatchAsync');
const Middleware = require('../utils/Middleware');
const Campgrounds = require('../controllers/campgrounds');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * GET /campgrounds
 * @function
 * @async
 * @memberof module:routes/campgrounds
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
campgroundsRouter.route('/')
    .get(catchAsync(Campgrounds.findAll))
    /**
     * POST /campgrounds
     * @function
     * @async
     * @memberof module:routes/campgrounds
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    .post(Middleware.login, upload.array('image'), catchAsync(Campgrounds.makeNewCampground));

/**
 * GET /campgrounds/search
 * @function
 * @async
 * @memberof module:routes/campgrounds
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
campgroundsRouter.get('/search', Campgrounds.findByFilter);

/**
 * GET /campgrounds/new
 * @function
 * @async
 * @memberof module:routes/campgrounds
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
campgroundsRouter.get('/new', Middleware.login, Campgrounds.renderNewForm);

/**
 * GET /campgrounds/:id
 * @function
 * @async
 * @memberof module:routes/campgrounds
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
campgroundsRouter.route('/:id')
    .get(catchAsync(Campgrounds.findById))
    /**
     * PUT /campgrounds/:id
     * @function
     * @async
     * @memberof module:routes/campgrounds
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    .put(Middleware.login, Middleware.isAuthor, Validation.campground, catchAsync(Campgrounds.editCampground))
    /**
     * DELETE /campgrounds/:id
     * @function
     * @async
     * @memberof module:routes/campgrounds
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    .delete(Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.deleteCampground));

/**
 * GET /campgrounds/:id/edit
 * @function
 * @async
 * @memberof module:routes/campgrounds
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
campgroundsRouter.get('/:id/edit', Middleware.login, Middleware.isAuthor, catchAsync(Campgrounds.renderEditForm));

module.exports = campgroundsRouter;