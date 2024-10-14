const User = require('../models/user')

const Users = {
    showRegister: (req, res) => {
        res.render('users/register')
    },

    register: async (req, res, next) => {
        try{
            const {username, email, password} = req.body
            const newUser = new User({username: username, email: email})
            const registeredUser = await User.register(newUser, password)
            console.log(registeredUser);
            req.login(registeredUser, err => {
                if(err) return next(err);
                req.flash('success', 'Welcome to YelpCamp!')
                res.redirect('/campgrounds')
            })
        } catch(e) {
            res.redirect('/register')
        }
    },
    
    showLogin: (req,res) => {
        res.render('users/login')
    },

    login: (req, res) => {
        const redirectUrl = res.locals.returnTo || '/campgrounds'
        req.flash('success', `Welcome Back!`)
        res.redirect(redirectUrl)
    },

    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/campgrounds');
        });
    }
}

module.exports = Users