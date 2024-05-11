const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('ready', () => {
    console.log(`Bot is online and logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild || message.content.toLowerCase() !== '!verify') {
        return;
    }

    console.log("Command '!verify' recognized.");
    const authUrl = `${process.env.SERVER_URL}/auth`;
    console.log(`Authentication URL: ${authUrl}`);

    try {
        await message.reply(`Please click the following link to authenticate with Discord: ${authUrl}`);
        console.log(`Verification link sent to user ${message.author.tag}.`);
    } catch (error) {
        console.error("Failed to send verification link:", error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

process.on("SIGINT", () => {
    client.destroy();
    process.exit();
});
