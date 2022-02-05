const express = require('express');
const cors = require('cors');
const MongoService = require('./services/mongoService');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoService = new MongoService();
const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());
mongoService.initializeMessage();

function requireLogin(req, res, next) {
    if (req.session && req.session.loggedin) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.all("/admin/*", requireLogin, function (req, res, next) {
    next();
});

app.get("/admin/home", function (req, res) {
    res.send("You are now logged in. You can make crud actions as admin! :)")
});

app.get(['/', '/login'], function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post("/auth", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const isAdminPromise = mongoService.checkForAdmin(username, password);
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


app.get('/messages', (req, res) => {
    let messages = mongoService.getAllMessages();
    messages.then(data => {
        res.send(data);
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
})

app.get('/messages/:id', (req, res) => {
    const messages = mongoService.getMessagesById(req.params.id)
    messages.then(data => {
        if (data.length == 0) {
            res.status(404);
            res.send("oh no");
        } else {
            res.send(data);
        }
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});