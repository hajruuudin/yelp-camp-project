const Middleware = {
    login: (req, res, next) => {
        if(!req.isAuthenticated()){
            req.session.returnTo = req.originalUrl
            return res.redirect('/login')
        }
        next()
    },
    storeReturnTo: (req, res, next) => {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    }
}


module.exports = Middleware;