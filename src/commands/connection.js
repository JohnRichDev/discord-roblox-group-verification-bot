const databaseService = require('../databaseService');

async function handleConnectionCommand(interaction) {
  if (await databaseService.isUserConnected(interaction.member.id)) {
    const robloxId = await databaseService.getConnectedRobloxId(interaction.member.id);
    await interaction.reply(`<@!${interaction.member.id}>, you are connected to Roblox ID: ${robloxId}.`);
  } else {
    await interaction.reply(`<@!${interaction.member.id}>, you are not connected!`);
  }
}

module.exports = { handleConnectionCommand };