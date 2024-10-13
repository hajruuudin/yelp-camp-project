const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const Middleware = require('../utils/Middleware')

userRouter.get('/register', (req, res) => {
    res.render('users/register')
})

userRouter.post('/register', catchAsync( async (req, res, next) => {
    try{
        const {username, email, password} = req.body
        const newUser = new User({username: username, email: email})
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            res.redirect('/campgrounds')
        })
    } catch(e) {
        res.redirect('/register')
    }
}))

userRouter.get('/login', (req,res) => {
    res.render('users/login')
})

userRouter.post('/login', Middleware.storeReturnTo, passport.authenticate('local', 
    {
        failureFlash: true,
        failureRedirect: '/login'
    }
), (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
})

userRouter.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/campgrounds');
    });
}); 


module.exports = userRouter