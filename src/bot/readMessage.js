const { client } = require('./botConnection');
const { embedBuilder } = require('./embedMessage');
const rsnArray = require('../../whitelistRSNs.json');
const itemArray = require('../../whitelistItems.json');

const readNewMessages = () => {
  try {
    client.on("messageCreate", message => {
      const readChannelId = process.env.LOCATION === 'clan' ? process.env.READ_CHANNEL_ID_CLAN : process.env.READ_CHANNEL_ID_PERSONAL;
      const writeChannelId = process.env.LOCATION === 'clan' ? process.env.WRITE_CHANNEL_ID_CLAN : process.env.WRITE_CHANNEL_ID_PERSONAL;
      const botId = process.env.LOCATION === 'clan' ? process.env.BOT_ID_CLAN : process.env.BOT_ID_PERSONAL;

      // Used for setting up to fetch botId when writing to channel. Need botId so we don't have an infinite loop of reading and writing to our own messages
      // if (process.env.NODE_ENV === 'production' && parseInt(message?.author?.id) !== parseInt(botId)
      //   && message?.channelId == readChannelId) {
      //   console.log(`MESSAGE: ${JSON.stringify(message)}`);
      // }

      // Filter out screenshots (comes in as a map and shouldn't be there on normal embeds messages)
      if (!message?.attachments?.size) {
        const embedsData = message?.embeds[0]?.data;
        // Only reading messages in specific Channel
        if (message?.channelId == readChannelId && message?.author?.id !== botId && !embedsData?.description.includes('Loot Chest')) {
          // Checks to make sure pet isn't in it because the Embed message data for Pet has almost nothing in it.
          if (embedsData?.description.includes('pet.')) {
            console.log(message?.embeds);
            const messageBuilt = embedBuilder(embedsData);
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [messageBuilt] });
          } else {
            const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
            const itemFiltered = itemFilterHelper(embedsData?.description);
            if (!itemFiltered) {
              console.error(`MISSING ITEMS: ${JSON.stringify(embedsData)}`);
            }
            // Checks whitelisted items & users first
            // Makes sure the loot isn't from pvp (loot chest)
            else if (rsnFiltered?.length !== 0 && itemFiltered?.length !== 0) {
              console.log(message?.embeds[0]);
              const messageBuilt = embedBuilder(embedsData);
              client.channels.cache.get(`${writeChannelId}`).send({ embeds: [messageBuilt] });
            }
            // message.delete().catch((err) => {
            //   console.error(`Error deleting message: ${err}`);
            // })
          }
        }
      }
    });
  } catch (err) {
    console.error(err?.message ?? err);
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