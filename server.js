const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const constants = require('./utils/consts');
const app = express();

const { mongo } = require('./services');
const { messages, auth, admin } = require('./routes');
const swaggerDocument = require('./swagger/swagger.json');

const PORT = 3000;

// Use swagger
const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ['./routes/messages.js', './routes/admin.js', './routes/auth.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        swaggerOptions: swaggerOptions,
    })
);

const whitelist = ["http://localhost:3001","http://localhost:3000","http://localhost:63343"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongo.initializeMessage();

app.use('/api', messages);
app.use('/api', auth);
app.use('/api', admin);

const httpServer = http.createServer(app);
const io = socketio(httpServer, { cors: { origins: '*:*' } });
httpServer.listen(PORT, () => console.log(`Listening to port ${PORT}`));

let count = 0;
io.on('connection', function (socket) {
    let inserted = mongo.adminCrudAction({
        type: constants.ADD_USER,
    })
    inserted.then(data => {
        if (data) {
            io.sockets.emit('message', { count: 0 });
            console.log("ok")
        } else {
            console.log("bad")
        }
    })

    socket.on('disconnect', () => {
        let deleted = mongo.adminCrudAction({
            type: constants.DELETE_USER,
        })
        deleted.then(data => {
            if (data) {
                io.sockets.emit('message', { count: 0 });
                console.log("ok")
            } else {
                console.log("bad")
            }
        })
    });
});

