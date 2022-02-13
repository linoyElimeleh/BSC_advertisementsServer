const express = require('express');
const router = express.Router();
const {mongo} = require('../services');

/**
 * @swagger
 * /api/messages:
 *   get:
 *     description: Get all messages
 *     responses:
 *       200:
 *         description: Success
 *
 */
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

/**
 * @swagger
 * /api/messages/:id:
 *   get:
 *     description: Get all messages
 *     parameters:
 *     - name: id
 *       description: Get specific message
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       200:
 *         description: Success
 *
 */
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