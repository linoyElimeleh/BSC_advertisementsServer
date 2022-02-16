const express = require('express');
const router = express.Router();
const path = require('path');
const {mongo, loginService} = require('../services');
const constants = require('../utils/consts');

router.all("/admin/*", loginService, function (req, res, next) {
    next();
});

router.get("/admin/home", function (req, res) {
    res.send("You are now logged in. You can make crud actions as admin! :)")
});

router.get(['/', '/login'], function (req, res) {
    res.sendFile(path.resolve('./views/login.html'), );
});

/**
 * @swagger
 * /api/auth:
 *   post:
 *     description: Login
 *     tags:
 *      - auth
 *     parameters:
 *     - name: username
 *       description: Get specific username
 *       in: formData
 *       required: true
 *       type: String
 *     - name: password
 *       description: Get specific password
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       200:
 *         description: Success
 *
 */
router.post("/auth", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const isAdminPromise = mongo.adminCrudAction({
            type: constants.IS_ADMIN,
            username: username,
            password: password
        });
        isAdminPromise.then(isAdmin => {
            if (isAdmin) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/api/admin/home');
            } else {
                res.status(401);
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