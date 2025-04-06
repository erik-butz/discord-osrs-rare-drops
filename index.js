const { loginToBot } = require('./src/bot/botConnection');
const { readNewMessages } = require('./src/bot/readMessage');
const { fetchWomUsers } = require('./src/bot/helpers/womNameFetch');

loginToBot();

readNewMessages();

setInterval(() => {
  fetchWomUsers();
}, 21600000);
