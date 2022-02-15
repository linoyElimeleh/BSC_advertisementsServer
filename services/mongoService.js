const {MongoClient} = require('mongodb');
const fs = require('fs');
const uri = "mongodb://localhost:27017"
const databaseName = 'advertisementsDb';
const adminDatabaseName = 'creds';
const collectionName = 'Messages';
const adminsCollectionName = 'admins';
const activeUsersCollectionName = 'activeUsers';
let client;
let db;
const {hashSingleImage} = require("./photoHaseService");
const constants = require('../utils/consts');

class mongoService {

    constructor() {
        client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async getAllMessages() {
        let messages;
        try {
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

    async getAllUsers() {
        let users;
        try {
            await client.connect();
            db = await client.db(databaseName)
            users = await this.getUsersRequest()
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
            return users;
        }
    }

    async getMessagesById(id) {
        let messages;
        try {
            await client.connect();
            db = await client.db(databaseName)
            messages = await this.getMessageRequest(id)
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
            return messages;
        }
    }

    async getUserById(id) {
        let user;
        try {
            await client.connect();
            db = await client.db(databaseName)
            user = await this.insertActiveUser(id)
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
            return user;
        }
    }

    async adminCrudAction(req) {
        let successPromise;
        let success;
        try {
            await client.connect();
            switch (req.type) {
                case constants.IS_ADMIN:
                    db = await client.db(adminDatabaseName)
                    success = await this.getAdminRequest(req.username, req.password);
                    break;
                case constants.CREATE_NEW_AD:
                    db = await client.db(databaseName)
                    successPromise = await this.getInsertRequest(req.ad);
                    success = successPromise.insertedId;
                    break;
                case constants.DELETE_AD:
                    db = await client.db(databaseName)
                    successPromise = await this.getDeleteRequest(req.messageName);
                    success = successPromise.deletedCount > 0;
                    break;
                case constants.REPLACE_AD:
                    db = await client.db(databaseName)
                    successPromise = await this.getReplaceRequest(req.messageName,req.ad);
                    success = successPromise.modifiedCount > 0;
                    break;
                case constants.ADD_USER:
                    db = await client.db(databaseName)
                    successPromise = await this.insertActiveUser();
                    success = successPromise.modifiedCount > 0;
                    break;
                case constants.DELETE_USER:
                    db = await client.db(databaseName)
                    successPromise = await this.getUserDeleteRequest();
                    success = successPromise.modifiedCount > 0;
                    break;
                default:
                    throw 'should not get here'
            }
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
            if(success){
                return true;
            }
            return false;
        }
    }

    async initializeMessage() {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            db = await client.db(databaseName);
            await db.dropDatabase();
            let rawData = await fs.readFileSync('data-from-server.json');
            let messages = JSON.parse(rawData);
            this.addHashedImages(messages);
            await db.collection(collectionName).insertMany(messages)
            await db.collection(activeUsersCollectionName).insertOne({name: "users", count:0});
        } catch (e) {
            console.error(e);
        }
    }

    addHashedImages(messages) {
        messages.forEach(m => {
            m["photoHash"] = [];
            m.images.forEach(img => {
                m["photoHash"].push(hashSingleImage(img))
            })
        })
    }

    async getMessagesRequest() {
        let cursor = db.collection(collectionName).find({});
        let messagesPromise = await new Promise(resolve => cursor.toArray(function (err, items) {
            resolve(items);
        }));
        return messagesPromise;
    }

    async getMessageRequest(id) {
        let cursor = db.collection(collectionName).find({
            ids: parseInt(id)
        });
        let messagesPromise = await new Promise(resolve => cursor.toArray(function (err, items) {
            resolve(items);
        }));
        return messagesPromise;
    }

    async getAdminRequest(username, password) {
        let isAdmin = await db.collection(adminsCollectionName).findOne({username : username, password: password});
        return isAdmin;
    }

    async getInsertRequest(ad) {
        let added = await db.collection(collectionName).insertOne(ad);
        return added;
    }

    async getDeleteRequest(messageName) {
        let deleted = await db.collection(collectionName).deleteOne({messageName: messageName});
        return deleted;
    }

    async getReplaceRequest(messageName, newAd) {
        let replaced = await db.collection(collectionName).replaceOne({messageName: messageName}, newAd);
        return replaced;
    }

    async insertActiveUser() {
        let added = await db.collection(activeUsersCollectionName).updateOne({name:"users"},{$inc: {count:1}});
        return added;
    }

    async getUsersRequest() {
        let firstDoc = db.collection(activeUsersCollectionName).findOne();
        return firstDoc;
    }

    async getUserDeleteRequest() {
        let deleted = await db.collection(activeUsersCollectionName).updateOne({name:"users"},{$inc: {count:-1}});
        return deleted;
    }
}

module.exports = mongoService;