const { client } = require('./botConnection');
const rsnArray = require('../../whitelistRSNs.json');
const itemArray = require('../../whitelistItems.json');

const readNewMessages = () => {
  try {
    client.on("messageCreate", message => {

      const readChannelId = process.env.LOCATION === 'clan' ? process.env.READ_CHANNEL_ID_CLAN : process.env.READ_CHANNEL_ID_PERSONAL;
      const writeChannelId = process.env.LOCATION === 'clan' ? process.env.WRITE_CHANNEL_ID_CLAN : process.env.WRITE_CHANNEL_ID_PERSONAL;
      const botId = process.env.LOCATION === 'clan' ? process.env.BOT_ID_CLAN : process.env.BOT_ID_PERSONAL;
      const combatAchievementWriteChannelId = process.env.LOCATION === 'clan' ? process.env.WRITE_CHANNEL_ID_COMBAT_ACHIEVEMENTS_CLAN : process.env.WRITE_CHANNEL_ID_COMBAT_ACHIEVEMENTS_PERSONAL;
      const miscAchievementsWriteChannelId = process.env.LOCATION === 'clan' ? process.env.WRITE_CHANNEL_ID_MISC_ACHIEVEMENTS_COUNT_CLAN : process.env.WRITE_CHANNEL_ID_MISC_ACHIEVEMENTS_COUNT_PERSONAL;
      // Used for setting up to fetch botId when writing to channel. Need botId so we don't have an infinite loop of reading and writing to our own messages
      // if (process.env.NODE_ENV === 'production' && parseInt(message?.author?.id) !== parseInt(botId)
      //   && message?.channelId == readChannelId) {
      //   console.log(`MESSAGE: ${JSON.stringify(message)}`);
      // }

      if (message?.channelId === readChannelId) {
        const embedsData = message?.embeds[0];
        //Filtering out the old loot logger
        const newLootLogger = embedsData?.timestamp ? true : false;

        // Only reading messages in specific Channel
        if (message?.author?.id !== botId && newLootLogger) {
          console.log(`MESSAGE: ${JSON.stringify(message)}`);
          const filterLootPhrases = [
            'has a funny feeling they are being followed',
            'to their collection log'
          ];
          const filterCombatPhrases = [
            'combat task:',
            'has just beat their personal best in a speedrun of',
            'has just finished a speedrun of'
          ];
          const filterMiscPhrases = [
            'clue, they have completed',
            'with a completion count of',
            'with a new personal best time of'
          ];
          // CLOGS & PETS
          if (filterLootPhrases.some(phrase => embedsData?.description.includes(phrase))) {
            client.channels.cache.get(`${writeChannelId}`).send({ embeds: [embedsData] });
          }
          // COMBAT ACHIEVEMENTS
          else if (filterCombatPhrases.some(phrase => embedsData?.description.includes(phrase))) {
            client.channels.cache.get(`${combatAchievementWriteChannelId}`).send({ embeds: [embedsData] });
          }

          // SPEED RUNS & KILL COUNTS
          else if (filterMiscPhrases.some(phrase => embedsData?.description.includes(phrase))) {
            client.channels.cache.get(`${miscAchievementsWriteChannelId}`).send({ embeds: [embedsData] });
          }
          else {
            // const rsnFiltered = rsnFilterHelper(embedsData?.author?.name);
            const itemFiltered = itemFilterHelper(embedsData?.description);
            if (!itemFiltered) {
              // console.error(`No Item Found For ${embedsData?.author?.name}: ${JSON.stringify(embedsData?.description)}`);
            }
            // Checks whitelisted items & users first
            // else if (rsnFiltered?.length !== 0 && itemFiltered?.length !== 0) {
            else if (itemFiltered?.length !== 0) {
              console.log(`itemFiltered: ${itemFiltered}`);
              client.channels.cache.get(`${writeChannelId}`).send({ embeds: [embedsData] });
            }
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
    // const regex2 = new RegExp(String.raw`\[${foundItems[0]}\]\(https: \/\/oldschool\.runescape\.wiki\/w\/Special:Search\?search=Treasonous%20ring\) \(105K\)`);
    // let foundItems2 = description.match(regex2);
    // console.log(foundItems2);
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