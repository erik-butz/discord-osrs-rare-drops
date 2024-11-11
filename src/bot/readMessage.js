const { client } = require('./botConnection');
const { embedBuilder } = require('./embedMessage');
const rsnArray = require('../../whitelistRSNs.json');
const itemArray = require('../../whitelistItems.json');

const readNewMessages = () => {
  try {
    client.on("messageCreate", message => {
      // Only reading messages in specific Channel
      // console.log(message?.embeds[0]);
      // 1263911679268487299 = rare drops channel
      if (message?.channelId == '1263911679268487299' && message?.author?.id !== '1289952988525232238') {
        const embedsData = message?.embeds[0]?.data;
        const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
        const itemFiltered = itemFilterHelper(embedsData?.description);
        // Checks to make sure pet isn't in it because the Embed message data for Pet has almost nothing in it.
        if (embedsData?.description.includes('pet')) {
          const messageBuilt = embedBuilder(embedsData);
          client.channels.cache.get(`1293327521168887922`).send({ embeds: [messageBuilt] });
        }
        // Checks whitelisted items & userss first
        // Makes sure the loot isn't from pvp (loot chest)
        else if (rsnFiltered?.length !== 0 && itemFiltered?.length !== 0 && !embedsData?.description.includes('Loot Chest')) {
          console.log(message?.embeds[0]);
          const messageBuilt = embedBuilder(embedsData);
          client.channels.cache.get(`1293327521168887922`).send({ embeds: [messageBuilt] });
        }
      }
    });
  } catch (err) {
    console.log(err?.message ?? err);
  }
};

const rsnFilterHelper = (runeScapeName) => {
  return nameFound = rsnArray?.names.filter((rsn) => rsn?.toLowerCase() === runeScapeName?.toLowerCase());
};

const itemFilterHelper = (description) => {
  const regex = /(?<=\[).+?(?=\])/;
  let foundItem = description?.match(regex);
  foundItem[0] = foundItem[0].replace(/'/, ''); ///cleaning up apostrophe's
  // console.log(foundItem[0].toLowerCase());
  return itemFound = itemArray?.names.filter((item) => item?.toLowerCase() === foundItem[0]?.toLowerCase());
};

module.exports = { readNewMessages };