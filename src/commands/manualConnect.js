const databaseService = require('../databaseService');
const { hasAdminPermissions } = require('../utils');

async function handleManualConnectCommand(interaction) {
  if (!hasAdminPermissions(interaction.member)) {
    await interaction.reply(`<@!${interaction.member.id}>, you don't have permission to use this command!`);
    return;
  }

  const user = interaction.options.getUser('user');
  const userId = interaction.options.getInteger('userid');

  if (user && userId) {
    await databaseService.connectUser(user.id, userId);
    await interaction.reply(`Successfully connected <@${user.id}> to Roblox ID: ${userId}`);
  } else {
    await interaction.reply('Please provide both a user and a Roblox user ID.');
  }
}

module.exports = { handleManualConnectCommand };