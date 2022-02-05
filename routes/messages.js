const express = require('express');
const router = express.Router();
const {mongo} = require('../services');

router.get('/messages', function (req, res) {
    let messages = mongo.getAllMessages();
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
    messages = mongo.getMessagesById(req.params.id);
    messages.then(data => {
        if (data.length === 0) {
            res.status(404);
            res.send("id not found");
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

module.exports = router;