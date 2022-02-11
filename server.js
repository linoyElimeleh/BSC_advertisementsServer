const express = require('express');
const {messages, auth, admin} = require('./routes');
const cors = require('cors');
const {mongo} = require('./services');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const swaggerDocument = require("./swagger/swagger.json");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Use swagger
const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ['./routes/messages.js'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        swaggerOptions: swaggerOptions,
    }));


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
app.use('/api', admin);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});