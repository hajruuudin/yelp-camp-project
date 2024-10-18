const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const Middleware = require('../utils/Middleware')
const Users = require('../controllers/users')

/**
 * GET /register
 * @function
 * @async
 * @memberof module:routes/users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
userRouter.get('/register', Users.showRegister);

/**
 * POST /register
 * @function
 * @async
 * @memberof module:routes/users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
userRouter.post('/register', catchAsync(Users.register));

/**
 * GET /login
 * @function
 * @async
 * @memberof module:routes/users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
userRouter.get('/login', Users.showLogin);

/**
 * POST /login
 * @function
 * @async
 * @memberof module:routes/users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
userRouter.post('/login', Middleware.storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), Users.login);

/**
 * GET /logout
 * @function
 * @async
 * @memberof module:routes/users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
userRouter.get('/logout', Users.logout);


module.exports = userRouter