require('dotenv').config();
const { QuickDB } = require('quick.db');
const axios = require('axios').default;
var Bottleneck = require("bottleneck/es5");

const limiter = new Bottleneck({
  reservoir: 200,
  reservoirRefreshAmount: 200,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 1,
  minTime: 333
});
 
  const db = new QuickDB();

  const { Client, ActivityType, EmbedBuilder, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, } = require('discord.js');
  const client = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] });
  
  const emjs = ["🚤", "🛶", "⛵", "🚊", "🚝", "🚈", "🚇", "🚡", "🚎", "🚐", "🚕", "🚗", "🚌", "🚑", "🚲", "💺"];
  
  const ranEmojis = (amount) => {
    let emj = "";
    for (let i = 0; i < amount; i++) {
      const num = Math.floor(Math.random() * emjs.length)
      emj += emjs[num];
    }
    return emj;
  }
  
  var departments = {}
  
  client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity({
      name: 'guests!',
      type: ActivityType.Listening,
    })
    departments = {
      15530308: client.guilds.cache.get('1002257852641050736').roles.cache.get('1002261236056068126'),
      1057779: client.guilds.cache.get('1002257852641050736').roles.cache.get('1002261418151776256'),
      15549895: client.guilds.cache.get('1002257852641050736').roles.cache.get('1002261451660079155'),
      15549920: client.guilds.cache.get('1002257852641050736').roles.cache.get('1002261471155204267'),
      15549890: client.guilds.cache.get('1002257852641050736').roles.cache.get('1002261487466840165'),
    }
  })
  
  client.on('guildMemberAdd', async (member) => {
    if (db.has(`${member.id}_ar_${member.guild.id}`)) {
      member.roles = await db.get(`${member.id}_ar_${member.guild.id}`)
    } else {
      const verified = member.guild.roles.cache.find((r) => r.name === 'Verified')
      const unverified = member.guild.roles.cache.find((r) => r.name === 'Unverified')
      if (db.has(member.id)) {
        member.roles.add(verified)
      } else {
        member.roles.add(unverified)
      }
    }
  })
  
  client.on('guildMemberRemove', (member) => {
    db.set(`${member.id}_ar_${member.guild.id}`, member.roles)
  })
  
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      const args = interaction.customId.split('|');
      if (args[0] == "CONFIRM") {
        limiter.schedule(() => axios.get(`https://users.roblox.com/v1/users/${args[1]}`)).then(gotUser => {
          if (gotUser.data.description == args[2]) {
            interaction.reply(`<@!${interaction.member.id}> SUCCESSFULLY CONNECTED! YOU CAN NOW USE \`/update\`!`).then(() => {
              setTimeout(() => {
                interaction.message.delete();
              }, 20000);
            });
            db.set(interaction.member.id, args[1]).then(() => {
              setTimeout(() => {
                interaction.message.delete();
              }, 20000);
            })
          } else {
            interaction.reply(`<${interaction.member.id}> YOU DID NOT PROVIDE THE CORRECT VERIFICATION CODE!`);
            interaction.message.delete()
          }
        })
      }
    }
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName == 'connect') {
        if (await db.has(interaction.member.id)) {
          console.log(await db.get(interaction.member.id))
          interaction.reply(`<@!${interaction.member.id}>, you are already connected!`).then(async () => {
            setTimeout(() => {
              interaction.message.delete();
            }, 20000);
          })
        } else {
          interaction.reply('Validating user...')
          limiter.schedule(() => axios.get(`https://users.roblox.com/v1/users/search?keyword=${interaction.options.getString('username')}&limit=10`)).then(gotUID => {
            if (gotUID.data.data.length > 0) {
              limiter.schedule(() => axios.get(`https://users.roblox.com/v1/users/${gotUID.data.data[0].id}`)).then(gotUser => {
                limiter.schedule(() => axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${gotUID.data.data[0].id}&size=720x720&format=Png&isCircular=false`)).then(rs => {
                  const verify = ranEmojis(10)
                  const embed = new EmbedBuilder()
                    .setTitle(`${gotUser.data.name}'s Profile`)
                    .setColor(0xFF0000)
                    .setThumbnail(rs.data.data[0].imageUrl)
                    .setDescription(`Name: \`${gotUser.data.displayName} (@${gotUser.data.name})\`\nDescription: \`${gotUser.data.description}\`\nCreation Date: \`${gotUser.data.created}\``)
                    .setFooter({
                      text: 'You have 300 seconds to confirm this is you!',
                    })
                    .setImage("https://cdn.discordapp.com/attachments/427261181628252181/1011261889201831967/unknown.png")
                    .addFields(
                      {
                        name: 'SET DESCRIPTION TO BEFORE CONFIRMING!',
                        value: `\`!${verify}!\``
                      }
                    );
                  const row = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setCustomId(`CONFIRM|${gotUID.data.data[0].id}|!${verify}!`)
                        .setEmoji('✅')
                        .setLabel('Confirm')
                        .setStyle('Success'),
                    )
                  interaction.editReply({
                    content: `<@!${interaction.member.id}>`,
                    embeds: [embed],
                    components: [row]
                  }).then((msg) => {
                    setTimeout(() => {
                      msg.delete()
                    }, 300000);
                  })
                });
              });
            } else {
              interaction.editReply('User not found.')
            }
          });
        }
      }
      if (interaction.commandName == 'update') {
        if (interaction.options.getUser('user')) {
          if (!interaction.memberPermissions.has('Administrator')) {
            interaction.reply(`<@!${interaction.member.id}>, you are not allowed to update other users!`)
            return;
          }
          const user = interaction.options.getUser('user')
          if (user == interaction.member.user) {
            if (await db.has(interaction.member.id)) {
              updateRank(interaction);
            } else {
              interaction.reply(`<@!${interaction.member.id}>, you are not connected to a Roblox account! Do \`/connect\` first and follow the instructions.`)
            }
          } else {
            if (await db.has(user.id)) {
              updateRank(interaction);
            } else {
              interaction.reply(`<@!${interaction.member.id}>, this user is not connected to a Roblox account!`)
            }
          }
        } else {
          if (await db.has(interaction.member.id)) {
            updateRank(interaction);
          } else {
            interaction.reply(`<@!${interaction.member.id}>, you are not connected to a Roblox account! Do \`/connect\` first and follow the instructions.`).finally(() => {
              setTimeout(() => {
                interaction.message.delete();
              }, 20000);
            })
          }
        }
      }
      if (interaction.commandName == 'disconnect') {
        if (await db.has(interaction.member.id)) {
          await db.delete(interaction.member.id).then(() => {
            interaction.reply(`<@!${interaction.member.id}>, you have been disconnected from your Roblox account.`).then(() => {
              setTimeout(() => {
                interaction.message.delete();
              }, 20000);
            })
          })
        } else {
          interaction.reply(`<@!${interaction.member.id}>, you are not connected to a Roblox account! Do \`/connect\` first and follow the instructions.`).then(() => {
            setTimeout(() => {
              interaction.message.delete();
            }, 20000);
          })
        }
      }
      if (interaction.commandName == 'connection') {
        if (await db.has(interaction.member.id)) {
          interaction.reply(`<@!${interaction.member.id}>, you are connected.`)
        } else {
          interaction.reply(`<@!${interaction.member.id}>, you are not connected!`)
        }
      }
      if (interaction.commandName == 'manual_connect') {
        if (interaction.options.getUser('user') && interaction.options.getInteger('userid')) {
          db.set(interaction.options.getUser('user').id, interaction.options.getInteger('userid'))
          interaction.reply('SET!')
        }
      }
    }
  })
  
  const groupIds = [15511384, 15530308, 1057779, 15549895, 15549920, 15549890]
  const ranks = {
    15511384: {
      254: "[CM]",
      26: "[CW]",
      25: "[P]",
      24: "[VP]",
      23: "[E]",
      22: "[ED]",
      21: "[BOD]",
      20: "[GM]",
      19: "[AGM]",
      18: "[M]",
      17: "[AM]",
      16: "[S]",
      15: "[AS]",
      14: "[SS]",
    },
    15530308: {
      9: "[Coord]",
      8: "[SRR]",
      7: "[RR]",
      6: "[JRR]",
      5: "[STR]",
      4: "[TR]",
      3: "[JTR]",
      2: "[Trainee]",
    },
    1057779: {
      9: "[Coord]",
      8: "[CSO]",
      7: "[SO]",
      6: "[JSO]",
      5: "[CSG]",
      4: "[SG]",
      3: "[JSG]",
      2: "[Trainee]",
    },
    15549895: {
      9: "[Coord]",
      8: "[SCE]",
      7: "[CE]",
      6: "[JCE]",
      5: "[SR]",
      4: "[R]",
      3: "[JR]",
      2: "[Trainee]",
    },
    15549920: {
      9: "[Coord]",
      8: "[SCF]",
      7: "[CF]",
      6: "[JCF]",
      5: "[SB]",
      4: "[B]",
      3: "[JB]",
      2: "[Trainee]",
    },
    15549890: {
      9: "[Coord]",
      8: "[SH]",
      7: "[H]",
      6: "[JH]",
      5: "[SC]",
      4: "[C]",
      3: "[JC]",
      2: "[Trainee]",
    },
  }
  
  const defaultRoles = ["Chairman", "Chairwoman", "President", "Vice President", "Engineers", "Executive Director", "Board of Directors", "General Manager", "Assistant General Manager", "Manager", "Assistant Manager", "Supervisor", "Assistant Supervisor", "Support Staff", "Security", "Concierge", "Receptionist", "Chef", "Barista", "Housekeeper", "Custodian", "Trainee", "Ally Ambassador", "Honored Staff", "Respected Guest", "Suspended", "Resident", "Guest",]
  
  async function updateRank(interaction) {
    var user = interaction.member;
    if (interaction.options.getUser('user')) user = interaction.guild.members.cache.find((u) => u.id == interaction.options.getUser('user').id);
    if (await db.has(user.id)) {
      var toAdd = [];
      var toRemove = [];
      var stats = "";
      defaultRoles.forEach(defaultRole => {
        const foundRole = user.roles.cache.find(r => r.name === defaultRole)
        if (foundRole) {
          toRemove.push(foundRole)
        }
      })
      limiter.schedule(async () => axios.get(`https://groups.roblox.com/v2/users/${await db.get(user.id)}/groups/roles`))
        .then(groups => {
          for (const count in groups.data.data) {
            if (Object.hasOwnProperty.call(groups.data.data, count)) {
              const group = groups.data.data[count].group
              const role = groups.data.data[count].role
              if (groupIds.includes(group.id)) {
                const foundRole = interaction.guild.roles.cache.find(r => r.name === role.name)
                if (foundRole) {
                  toAdd.push(foundRole)
                }
              }
              if (Object.hasOwnProperty.call(ranks, group.id)) {
                if (Object.hasOwnProperty.call(ranks[group.id], role.rank)) {
                  limiter.schedule(async () => axios.get(`https://users.roblox.com/v1/users/${await db.get(user.id)}`)).then(gotUser => {
                    user.setNickname(`${ranks[group.id][role.rank]} ${gotUser.data.name}`).catch((e) => { })
                  })
                }
              }
              if (interaction.guild.id == '1002257852641050736') {
                if (Object.hasOwnProperty.call(departments, group.id)) {
                  if (parseInt(role.rank) >= 2) {
                    const role = departments[group.id]
                    if (role) {
                      toAdd.push(role)
                    }
                  }
                }
              }
            }
          }
          toRemove.forEach((role) => {
            if (toAdd.includes(role)) {
              toRemove.splice(toRemove.indexOf(role), 1)
            }
          })
          toAdd.forEach((role) => {
            if (!user.roles.cache.has(role.id)) {
              stats += `+ Added \`${role.name}\`\n`
            }
          })
          toRemove.forEach((role) => {
            stats += `- Removed \`${role.name}\`\n`
          })
          toRemove.forEach((role) => {
            user.roles.remove(role)
          })
          toAdd.forEach((role) => {
            user.roles.add(role)
          })
          if (stats == '') stats = '+ ROLES UP-TO-DATE!';
          const embed = new EmbedBuilder()
            .setTitle('Updated')
            .setColor(0xFFFF00)
            .setDescription(`\`${user.nickname}\`\n\`\`\`diff\n${stats}\`\`\``)
          interaction.reply({
            content: `<@!${interaction.member.id}>`,
            embeds: [embed]
          })
        })
    }
  }
  
  client.login(process.env.TOKEN);