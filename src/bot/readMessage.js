const { client } = require('./botConnection');
const { embedBuilder } = require('./embedMessage');
const rsnArray = require('../../whitelistRSNs.json');
const itemArray = require('../../whitelistItems.json');

const readNewMessages = () => {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.on("messageCreate", message => {
    // Only reading messages in specific Channel
    const embedsData = message.embeds[0].data;
    // 1263911679268487299 = rare drops channel
    // 1289963294710431744 = raredroptesting channel
    if (message.channelId == '1263911679268487299') {
      // Ignoring Discord bot message?.author?.id
      if (message?.author?.id !== '1289952988525232238') {
        const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
        const itemFiltered = itemFilterHelper(embedsData?.description);
        console.log(itemFiltered);
        if (rsnFiltered.length !== 0 && itemFiltered.length !== 0) {
          const messageBuilt = embedBuilder(embedsData);
          message.channel.send({ embeds: [messageBuilt] });
        }
      }
    }
  });
};

const rsnFilterHelper = (runeScapeName) => {
  return nameFound = rsnArray?.names.filter((rsn) => rsn.toLowerCase() === runeScapeName.toLowerCase());
};

const itemFilterHelper = (description) => {
  const regex = /(?<=\[).+?(?=\])/;
  const foundItem = description.match(regex);
  console.log(foundItem[0].toLowerCase());
  return itemFound = itemArray?.names.filter((item) => item.toLowerCase() === foundItem[0].toLowerCase());
};

module.exports = { readNewMessages };