const express = require('express');
const {getAllMessages} = require('./messagesService.js');
const {getMessageById} = require("./messagesService");
const cors = require('cors');
const MongoService = require('./MongoService');
const mongoService = new MongoService();
const app = express();
const port = 3000;

app.use(cors());

app.get('/messages', (req, res) => {

    // Add this row if you want to initialize the data on mongo
    //mongoService.initializeMessage();

    let messages = mongoService.getAllMessages();
    messages.then(data => {
        let newData = getAllMessages(data);
        res.send(newData);
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
})

app.get('/messages/:id', (req, res) => {
    const message = getMessageById(req.params.id);

    if (message == "not found") {
        res.status(404);
        res.send("oh no");
    }
    else {
        res.send(message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});