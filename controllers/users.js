if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const User = require('../models/user')

const Users = {
    /**
     * Renders the registration form.
     * @function showRegister
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} Renders the registration view.
     */
    showRegister: (req, res) => {
        res.render('users/register');
    },

    /**
     * Registers a new user.
     * @async
     * @function register
     * @param {Object} req - The request object containing user information.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function in the stack.
     * @returns {Promise<void>} Redirects to the campground page upon successful registration.
     * @throws {Error} Redirects to the registration page if registration fails.
     */
    register: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username: username, email: email });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to YelpCamp!');
                res.redirect('/campgrounds');
            });
        } catch (e) {
            res.redirect('/register');
        }
    },
    
    /**
     * Renders the login form.
     * @function showLogin
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} Renders the login view.
     */
    showLogin: (req, res) => {
        res.render('users/login');
    },

    /**
     * Logs in an existing user.
     * @function login
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} Redirects to the user's intended destination or to the campgrounds page.
     */
    login: (req, res) => {
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        req.flash('success', `Welcome Back!`);
        res.redirect(redirectUrl);
    },

    /**
     * Logs out a user.
     * @function logout
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function in the stack.
     * @returns {void} Redirects to the campgrounds page after logging out.
     */
    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/campgrounds');
        });
    }
};

module.exports = Users