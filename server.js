const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require("./swagger/swagger.json");
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const MongoService = require('./MongoService');

const mongoService = new MongoService();
const app = express();
const port = 3000;

app.use(cors());

// Use swagger
const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ['server.js'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        swaggerOptions: swaggerOptions,
    }));

// Initialize messages
mongoService.initializeMessages();

/**
 * @swagger
 * /messages:
 *   get:
 *     description: Get all messages
 *     responses:
 *       200:
 *         description: Success
 *
 */
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

/**
 * @swagger
 * /messages/:id:
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