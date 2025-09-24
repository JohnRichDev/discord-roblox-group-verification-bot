const { handleConnectCommand } = require('./commands/connect');
const { handleUpdateCommand } = require('./commands/update');
const { handleDisconnectCommand } = require('./commands/disconnect');
const { handleConnectionCommand } = require('./commands/connection');
const { handleManualConnectCommand } = require('./commands/manualConnect');

async function handleSlashCommand(interaction) {
  try {
    switch (interaction.commandName) {
      case 'connect':
        await handleConnectCommand(interaction);
        break;
      case 'update':
        await handleUpdateCommand(interaction);
        break;
      case 'disconnect':
        await handleDisconnectCommand(interaction);
        break;
      case 'connection':
        await handleConnectionCommand(interaction);
        break;
      case 'manual_connect':
        await handleManualConnectCommand(interaction);
        break;
      default:
        await interaction.reply('Unknown command.');
    }
  } catch (error) {
    console.error('Error handling slash command:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply('An error occurred while processing the command.');
    }
  }
}

module.exports = { handleSlashCommand };