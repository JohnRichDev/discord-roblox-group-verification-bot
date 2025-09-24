const databaseService = require('../databaseService');
const { deleteMessageAfterDelay } = require('../utils');

async function handleDisconnectCommand(interaction) {
  if (await databaseService.isUserConnected(interaction.member.id)) {
    await databaseService.disconnectUser(interaction.member.id);
    const reply = await interaction.reply(`<@!${interaction.member.id}>, you have been disconnected from your Roblox account.`);
    deleteMessageAfterDelay(reply);
  } else {
    const reply = await interaction.reply(`<@!${interaction.member.id}>, you are not connected to a Roblox account! Do \`/connect\` first and follow the instructions.`);
    deleteMessageAfterDelay(reply);
  }
}

module.exports = { handleDisconnectCommand };