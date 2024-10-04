const { client } = require('./botConnection');
const { embedBuilder } = require('./embedMessage');

const readNewMessages = () => {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.on("messageCreate", message => {
    // Only reading messages in specific Channel
    // 1263911679268487299 = rare drops channel
    // 1289963294710431744 = raredroptesting channel
    if (message.channelId = '1263911679268487299') {
      const embedsData = message.embeds[0].data;
      console.log(message.embeds[0].data);
      // Ignoring Discord bot message?.author?.id
      if (message?.author?.id !== '1289952988525232238') {
        const messageBuilt = embedBuilder(embedsData);
        message.channel.send({ embeds: [messageBuilt] });
      }
    }
  });
};

module.exports = { readNewMessages };