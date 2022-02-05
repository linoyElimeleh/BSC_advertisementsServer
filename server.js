const express = require('express');
const {messages, auth} = require('./routes');
const cors = require('cors');
const {mongo} = require('./services');
const session = require('express-session');
const bodyParser = require('body-parser');
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
mongo.initializeMessage();

app.use('/api', messages);
app.use('/api', auth);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});