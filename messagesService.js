'use strict';

const fs = require('fs');
const getAllMessages = () => {
    let rawData = fs.readFileSync('data-from-server.json');
    let messages = JSON.parse(rawData);

    messages.forEach(m => {
        m["photoHash"] = [];
        m.images.forEach(img => {
            m["photoHash"].push("data:image/png;base64, " + base64_encode(img));
        })
    })

    return messages;
};

const getMessageById = (id) => {
    let rawData = fs.readFileSync('data-from-server.json');
    let messages = JSON.parse(rawData);
    let filteredMessages = messages.filter(m => m.ids.includes(parseInt(id)));
    if (filteredMessages == null) {
        return "not found";
    }
    filteredMessages.map(filteredMessage => {
        filteredMessage["photoHash"] = [];
        filteredMessage.images.forEach(img => {
            filteredMessage["photoHash"].push("data:image/png;base64, " + base64_encode(img));
        })
    })
    return filteredMessages;
}

function base64_encode(fileName) {
    const bitmap = fs.readFileSync(fileName);
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
    getAllMessages,
    getMessageById
};