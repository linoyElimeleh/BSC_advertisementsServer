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
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

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

const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        //io.emit("new user", [...activeUsers]);
        let users = mongo.getAllUsers();
        users.then(usersToShow => {
            io.emit("new user", usersToShow);
        })
            .catch(function (e) {
                res.status(500, {
                    error: e
                });
            });
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });
});