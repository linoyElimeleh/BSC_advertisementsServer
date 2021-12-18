const express = require('express');
const {getAllMessages} = require('./messagesService.js');
const {getMessageById} = require("./messagesService");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/messages', (req, res) => {
    const messages = getAllMessages();
    res.send(messages);
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
    console.log(`Example app listening at http://localhost:${port}`)
});