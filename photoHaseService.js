'use strict';

const fs = require('fs');

const hashSingleImage = (img) => {
    return "data:image/png;base64, " + base64_encode(img)
}

function base64_encode(fileName) {
    const bitmap = fs.readFileSync(fileName);
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
    hashSingleImage
};