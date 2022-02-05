const express = require('express');
const router = express.Router();
const path = require('path');
const {mongo, loginService} = require('../services');

router.all("/admin/*", loginService, function (req, res, next) {
    next();
});

router.get("/admin/home", function (req, res) {
    res.send("You are now logged in. You can make crud actions as admin! :)")
});

router.get(['/', '/login'], function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

router.post("/auth", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const isAdminPromise = mongo.checkForAdmin(username, password);
        isAdminPromise.then(isAdmin => {
            if (isAdmin) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/admin/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

module.exports = router;