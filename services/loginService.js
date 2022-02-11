function requireLogin(req, res, next) {
    if (req.session && req.session.loggedin) {
        next();
    } else {
        res.redirect("/api/login");
    }
}

module.exports = requireLogin;