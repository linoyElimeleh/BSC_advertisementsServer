const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');

const app = express();

const { mongo } = require('./services');
const { messages, auth, admin } = require('./routes');
const swaggerDocument = require('./swagger/swagger.json');

const PORT = 3000;

// Use swagger
const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ['./routes/messages.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        swaggerOptions: swaggerOptions,
    })
);

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
mongo.initializeMessage();

app.use('/api', messages);
app.use('/api', auth);
app.use('/api', admin);

const httpServer = http.createServer(app);
const io = socketio(httpServer, { cors: { origins: '*:*' } });
httpServer.listen(PORT, () => console.log(`Listening to port ${PORT}`));

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

// const activeUsers = new Set();

export let count = 0;
io.on('connection', function (socket) {
    count++;
    io.sockets.emit('message', { count: count });

    socket.on('disconnect', () => {
        count--;
        io.sockets.emit('message', { count: count });
    });
});
