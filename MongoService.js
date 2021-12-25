const {MongoClient} = require('mongodb');
const fs = require('fs');
const uri = 'mongodb://localhost:27017';
const databaseName = 'Advertisement';
const collectionName = 'Messages';
let client;
let db;

class MongoService {

    constructor() {
        client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async getAllMessages() {
        let messages;
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            db = await client.db(databaseName)

            messages = await this.getMessagesRequest()
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
            return messages;
        }
    }

    async initializeMessage() {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            db = await client.db(databaseName)

            let rawData = await fs.readFileSync('data-from-server.json');
            let messages = JSON.parse(rawData);
            await db.collection(collectionName).insertMany(messages)
        } catch (e) {
            console.error(e);
        }
    }

    async getMessagesRequest() {
        let cursor = db.collection(collectionName).find({});
        let messagesPromise = await new Promise(resolve => cursor.toArray(function (err, items) {
            resolve(items);
        }));
        return messagesPromise;
    }
}

module.exports = MongoService;