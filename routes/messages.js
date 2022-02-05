const express = require('express');
const router = express.router();
const mongoService = require('./services');

router.get('/messages', function (req, res) {
    let messages = mongoService.getAllMessages();
    messages.then(data => {
        res.send(data);
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
});

router.get('/messages/:id', function (req, res) {
    let messages;
    messages = mongoService.getMessagesById(req.params.id);
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