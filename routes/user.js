const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const Middleware = require('../utils/Middleware')
const Users = require('../controllers/users')

userRouter.get('/register', Users.showRegister)

userRouter.post('/register', catchAsync( Users.register))

userRouter.get('/login', Users.showLogin)

userRouter.post('/login', Middleware.storeReturnTo, passport.authenticate('local', {failureFlash: true,failureRedirect: '/login'}), Users.login)

userRouter.get('/logout', Users.logout); 


module.exports = userRouter