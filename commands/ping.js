const { SlashCommandBuilder } = require('@discordjs/builders');

const command = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

// Raw data that can be used to register a slash command
const rawData = command.toJSON();