const mongoService = require('./mongoService');
const loginService = require('./loginService');
const mongo = new mongoService();

module.exports = {mongo, loginService};