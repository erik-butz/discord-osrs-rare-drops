const { client } = require('./botConnection');
const { embedBuilder } = require('./embedMessage');
const rsnArray = require('../../whitelistRSNs.json');
const itemArray = require('../../whitelistItems.json');

const readNewMessages = () => {
  try {
    client.on("messageCreate", message => {
      const readChannelId = process.env.NODE_ENV === 'production' ? process.env.READ_CHANNEL_ID_CLAN : process.env.READ_CHANNEL_ID_PERSONAL;
      const writeChannelId = process.env.NODE_ENV === 'production' ? process.env.WRITE_CHANNEL_ID_PERSONAL : process.env.WRITE_CHANNEL_ID_PERSONAL;
      const botId = process.env.NODE_ENV === 'production' ? process.env.BOT_ID_CLAN : process.env.BOT_ID_PERSONAL;
      // Filter out screenshots (comes in as a map and shouldn't be there on normal embeds messages)
      if (!message?.attachments?.size) {
        // Only reading messages in specific Channel
        // 1263911679268487299 = rare drops channel
        if (message?.channelId == readChannelId && message?.author?.id !== botId) {
          const embedsData = message?.embeds[0]?.data;
          const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
          const itemFiltered = itemFilterHelper(embedsData?.description);
          if (!itemFiltered && !embedsData?.description.includes('pet.')) {
            console.error(`MISSING ITEMS: ${JSON.stringify(embedsData)}`);
          }
          // Checks to make sure pet isn't in it because the Embed message data for Pet has almost nothing in it.
          if (embedsData?.description.includes('pet.')) {
            console.log(message?.embeds);
            const messageBuilt = embedBuilder(embedsData);
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [messageBuilt] });
          }
          // Checks whitelisted items & userss first
          // Makes sure the loot isn't from pvp (loot chest)
          else if (rsnFiltered?.length !== 0 && itemFiltered?.length !== 0 && !embedsData?.description.includes('Loot Chest')) {
            console.log(message?.embeds[0]);
            const messageBuilt = embedBuilder(embedsData);
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [messageBuilt] });
          }
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
  try {
    const regex = /(?<=\[).+?(?=\])/;
    let foundItem = description?.match(regex);
    foundItem[0] = foundItem[0]?.replace(/'/, ''); ///cleaning up apostrophe's
    // console.log(foundItem[0].toLowerCase());
    return itemFound = itemArray?.names?.filter((item) => item?.toLowerCase() === foundItem[0]?.toLowerCase());
  }
  catch (err) {
    console.error(`Error in itemFilterHelper for: ${description}`);
    return undefined;
  }
};

module.exports = { readNewMessages };