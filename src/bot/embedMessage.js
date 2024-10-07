const { EmbedBuilder } = require('discord.js');


const embedBuilder = (embedsData) => {
  // const owner = embedsData?.author?.name;
  // const descrpition = embedsData?.author?.descrpition;
  const embedMessage = new EmbedBuilder()
    .setTitle(embedsData?.author?.name)
    .setColor(0x0099FF)
    .setURL('https://discord.js.org/')
    // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription(embedsData?.description)
    .setThumbnail(embedsData?.thumbnail?.url)
    .addFields(
      { name: 'GE Value', value: embedsData?.fields[2]?.value },
    )
    // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    // .setTimestamp()
    .setFooter({ text: 'Butz OSRS Rare Drops Bot', iconURL: 'https://static.wikia.nocookie.net/darkrunescape/images/a/ae/Default.PNG/revision/latest?cb=20071210112833' });
  return embedMessage;
};



module.exports = { embedBuilder };