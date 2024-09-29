const { client } = require('./botConnection');

const readNewMessages = () => {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.on("messageCreate", message => {
    // Only reading messages in specific Channel
    if (message.channelId = '1289963294710431744') {
      console.log(message);
      // console.log(message.id !== 1290041386879680653);
      // Ignoring Discord bot message?.author?.id
      if (message?.author?.id !== '1289952988525232238') {
        // console.log(JSON.stringify(message));
        message.channel.send('NEW MESSAGE ALERT');
        // message.reply(`Replying to message ${message.content}`);
      }
    }
  });
};

module.exports = { readNewMessages };