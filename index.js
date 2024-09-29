const botConnection = require('./src/bot/botConnection');
const readNewMessages = require('./src/bot/readMessage');

botConnection.loginToBot();

readNewMessages.readNewMessages();
