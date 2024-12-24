const fs = require('fs');
const { WOMClient } = require('@wise-old-man/utils');
const client = new WOMClient();
const rsns = require('../../../whitelistRSNs.json');

const fetchWomUsers = async () => {
  try {
    console.log('Checking Wise Old Man for new Rigoroug Members!');
    const group = await client.groups.getGroupDetails(8082);

    group?.memberships?.forEach((member) => {
      const userName = member?.player?.username;
      if (!Object.values(rsns?.names).includes(userName)) {
        console.log(`New User Found, Adding: ${userName}`);
        rsns?.names.push(userName);
      }
      const json = JSON.stringify(rsns);
      fs.writeFileSync('whitelistRSNs.json', json);
    });
  } catch (err) {
    console.error(`Error in fetchWomUser: ${err?.message ?? err}`);
  }
};

module.exports = { fetchWomUsers };