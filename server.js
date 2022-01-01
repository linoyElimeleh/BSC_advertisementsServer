const express = require('express');
const cors = require('cors');
const MongoService = require('./MongoService');
const mongoService = new MongoService();
const app = express();
const port = 3000;

app.use(cors());
mongoService.initializeMessages();

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
        if(data.length == 0){
            res.status(404);
            res.send("oh no");
        }else{
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