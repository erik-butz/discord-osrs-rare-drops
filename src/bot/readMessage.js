const { client } = require('./botConnection');
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
        const embedsData = message?.embeds[0];

        // Only reading messages in specific Channel
        if (message?.channelId == readChannelId && message?.author?.id !== botId) {
          const filterPhrases = [
            'to their collection log',
            'has a funny feeling they are being followed',
            'has just finished a speedrun of',
            'with a completion count of',
            'combat task:',
            'clue, they have completed'
          ];
          if (filterPhrases.some(phrase => embedsData?.description.includes(phrase))) {
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [embedsData] });
          }
          const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
          const itemFiltered = itemFilterHelper(embedsData?.description);
          if (!itemFiltered) {
            console.error(`No Item Found For ${embedsData?.author?.name}: ${JSON.stringify(embedsData?.description)}`);
          }
          // Checks whitelisted items & users first
          else if (rsnFiltered?.length !== 0 && itemFiltered?.length !== 0) {
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [embedsData] });
          }
        }
        // message.delete().catch((err) => {
        //   console.error(JSON.stringify(`Message: ${JSON.stringify(message)}`));
        //   console.error(`Error deleting message: ${err?.message ?? err}`);
        // });
      }
    });
  } catch (err) {
    console.error(JSON.stringify(`Message: ${JSON.stringify(message)}`));
    console.error(err?.message ?? err);
  }
};

const rsnFilterHelper = (runeScapeName) => {
  return nameFound = rsnArray?.names.filter((rsn) => rsn?.toLowerCase() === runeScapeName?.toLowerCase());
};

const itemFilterHelper = (description) => {
  try {
    const regex = /(?<=\[).+?(?=\])/g;
    let foundItems = description.match(regex);
    if (!foundItems) return undefined;
    // Clean each found item: remove quantity after comma, trim whitespace, and strip apostrophes
    foundItems = foundItems.map((item) => item.split(',')[0].trim().replace(/'/g, '').toLowerCase());
    const lowerCaseItemArray = new Map((itemArray?.names).map((name) => [name.replace(/'/g, '').toLowerCase(), name]));
    const itemFound = foundItems.map((item) => lowerCaseItemArray.get(item)).filter(Boolean);
    return itemFound.length ? itemFound : undefined;
  }
  catch (err) {
    console.error(`Error in itemFilterHelper for: ${err?.message ?? err}`);
    console.error(`Description Error: ${description}`);
    return undefined;
  }
};

module.exports = { readNewMessages };