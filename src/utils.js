const config = require('../config.json');

function generateRandomEmojis(amount = config.bot.verification.emojiAmount) {
  let emj = "";
  for (let i = 0; i < amount; i++) {
    const num = Math.floor(Math.random() * config.emojis.length);
    emj += config.emojis[num];
  }
  return emj;
}

function deleteMessageAfterDelay(message, delay = config.bot.verification.messageDeleteDelay) {
  setTimeout(() => {
    if (message && message.delete) {
      message.delete().catch(console.error);
    }
  }, delay);
}

function hasAdminPermissions(member) {
  return member.permissions.has('Administrator');
}

module.exports = {
  generateRandomEmojis,
  deleteMessageAfterDelay,
  hasAdminPermissions
};