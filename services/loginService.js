function requireLogin(req, res, next) {
    if (req.session && req.session.loggedin) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = requireLogin;