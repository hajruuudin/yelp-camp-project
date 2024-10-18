/**
 * @module Application
 * 
 * YelpCamp - index.js should serve as the file to run on deployed/local run.
 *
 */

/** In case .env file is present, check to see what mode the application is running 
 * If local, use the .env configuration files
 * If production, use the deployed enviroment variables
*/
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

/**
 * Required libraries and local files
 */
const express = require('express'); // Server creation
const path = require('path');   // Joining paths later on in the file
const mongoose = require('mongoose');   // Database access library - MongoDB
const methodOverride = require('method-override');  // Used to override form methods to delete/put
const ejsMate = require('ejs-mate') // Partials and Templates used with ejs
const ExpressError = require('./utils/ExpressError');   // Local custom Express Error function
// Routes used in this project - specific routers from different routes
const campgroundsRouter = require('./routes/campgrounds');  
const reviewRouter = require('./routes/reviews')
const userRouter = require('./routes/user')
const session = require('express-session')  // Session tracker - Used in login and registering
const flash = require('connect-flash')  // Flashing different messages to the user
const passport = require('passport')    // Authentication & Authorisation middleware
const passportLocal = require('passport-local') // Authentication & Authorisation middleware
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');    // Preventing mongo injection in forms
const MongoDBStore = require('connect-mongo')(session)
const dbConn = process.env.DB_CONN  // Connection string for the database
const dbUrl = 'mongodb://localhost:27017/yelp-camp' // Local connection, in case the enviroment is local

/**
 * Connect to MongoDB based on the environment.
 * @function connectDB
 */
if(process.env.NODE_ENV !== 'production'){
    mongoose.connect(dbUrl, {})
} else {
    mongoose.connect(dbConn, {})
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
})

/**
 * Creating a Database store - this is specific for the production enviroment
 */
const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeasecret',
    touchAfter: 24 * 60 * 60
})

store.on('error', (e) => {
    console.log("Session store error", e)
})

/**
 * Session configuration
 */
const sessionConfig = {
    name: 'yelp-camp',
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitializes: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

/**
 * Application and Server configuration
 */
const app = express();  // App is used to start the server
app.engine('ejs', ejsMate)  // Ejs engine set to EJSMate, in order to allow partials and layouts
app.set('views', path.join(__dirname, 'views'));    // Serve pages into the 'views' directory
app.use('/docs', express.static(path.join(__dirname, 'out')));  // Serve docs from JSDocs into the /docs directory
app.set('view engine', 'ejs');  // Tempalting engine set to EJS
app.use(express.static('public'))   // Serve public files in the 'public' directory
app.use(express.urlencoded({extended: true}))   // Treat form data as URL encoded, needed to parse the data
app.use(methodOverride('_method'))  // Query string to override methods will be '_method'
app.use(session(sessionConfig)) // Use the session configuration previously specified
app.use(flash())    // Use flash messaged
app.use(mongoSanitize())    // Use mongo sanitisation on all inputs
// Authentication & Authorisation specific middleware;
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


/**
 * Middleware to set response locals for flash messages and current user.
 * @function setLocals
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/review', reviewRouter)
app.use('/', userRouter)


/**
 * Route handler for the home page.
 * @function home
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/', (req, res) => {
    res.render('home')
})

/**
 * Route handler for 404 errors.
 * @function pageNotFound
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.all("*", (req, res, next) => {
    next( new ExpressError("PAGE NOT FOUND", 404))
})

/**
 * Global error handling middleware.
 * @function errorHandler
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh no, something went wrong!";
    res.status(status).render('error', {err})
})

// Start the server
app.listen('8080', () => {
    console.log("YelpCamp App listening on 8080");
})