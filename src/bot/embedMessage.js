const { EmbedBuilder } = require('discord.js');


const embedBuilder = (embedsData) => {
  try {
    console.log(`embedsData: ${JSON.stringify(embedsData)}`);
    const embedMessage = new EmbedBuilder();
    embedMessage.setTitle(embedsData?.author?.name);
    embedMessage.setColor(0x0099FF);
    embedMessage.setDescription(embedsData?.description);
    embedMessage.setFooter({
      text: 'CAL-ZONE OSRS Rare Drops Bot', iconURL: 'https://static.wikia.nocookie.net/darkrunescape/images/a/ae/Default.PNG/revision/latest?cb=20071210112833'
    });
    // Only add the description GE Value field for non pet items (Not present on object in pet event)
    if (!embedsData?.description.includes('pet')) {
      embedMessage.addFields({ name: 'GE Value', value: embedsData?.fields[2]?.value });
      embedMessage.setThumbnail(embedsData?.thumbnail?.url);
    }

    // Extra fields that can be used to modify EmbedBuilder class
    // const owner = embedsData?.author?.name;
    // const descrpition = embedsData?.author?.descrpition;
    // .setURL('https://discord.js.org/')
    // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    return embedMessage;
  } catch (err) {
    console.log(`Error in embedBuilder: ${err}`);
    return;
  }
};

module.exports = { embedBuilder };