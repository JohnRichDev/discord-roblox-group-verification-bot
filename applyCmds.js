require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType }  = require('discord.js');

const commands = [
	{
		name: 'connect',
		description: 'Connect your Roblox account to your Discord account!',
		options: [
			{
				name: 'username',
				description: 'Your Roblox username.',
				required: true,
				type: ApplicationCommandOptionType.String
			},
			{
				name: 'method',
				description: 'Method of connection.',
				required: false,
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'Bio',
						value: 'bio'
					},
					{
						name: 'Game',
						value: 'game'
					}
				],
			}
		]
	},
	{
		name: 'disconnect',
		description: 'Disconnect your Roblox account from your Discord account!',
	},
	{
		name: 'update',
		description: 'Update your roles!',
		options: [
			{
				name: 'user',
				description: 'User to update.',
				required: false,
				type: ApplicationCommandOptionType.User
			}
		],
	},
	{
		name: 'connection',
		description: 'Check if your account is connected!',
	},
	{
		name: 'manual_connect',
		description: 'Manually connect users!',
		default_member_permissions: 1 << 3,
		options: [
			{
				name: 'user',
				description: 'The user.',
				required: true,
				type: ApplicationCommandOptionType.User
			},
			{
				name: 'userid',
				description: 'The Id of the user.',
				required: true,
				type: ApplicationCommandOptionType.Integer
			}
		]
	}
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();