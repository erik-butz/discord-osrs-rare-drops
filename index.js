const { loginToBot } = require('./src/bot/botConnection');
const { readNewMessages } = require('./src/bot/readMessage');
const { fetchWomUsers } = require('./src/bot/helpers/womNameFetch');

loginToBot();

readNewMessages();

console.log(process.env.NODE_ENV)

setInterval(() => {
  fetchWomUsers();
}, 21600000);
