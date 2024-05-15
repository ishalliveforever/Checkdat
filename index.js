const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Configure the Discord client
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
    if (message.author.bot || !message.guild) return; // Ignore messages from bots or outside of guilds

    if (message.content.toLowerCase() === '!verify') {
        const authUrl = `${process.env.SERVER_URL}/auth`;
        const button = new ButtonBuilder()
            .setLabel('Click to Verify')
            .setStyle(ButtonStyle.Link)
            .setEmoji('💻')
            .setURL(authUrl);
        const row = new ActionRowBuilder().addComponents(button);
        try {
            await message.reply({ content: 'Welcome to the 1Sat Society.To ensure a smooth and secure experience, we need all members to verify their wallets before gaining access. Please follow these simple steps to complete your verification 1. **Prepare Your Wallet:**Ensure that your wallet containing the 1Sat Ordinals NFT is ready.', components: [row] });
            console.log(`Verification link sent to user ${message.author.tag}.`);
        } catch (error) {
            console.error("Failed to send verification link:", error);
        }
    } else if (message.content.toLowerCase() === '!setlink') { // New command to send the embed with a link
        const embed = new EmbedBuilder()
            .setColor(0xFFA500) // Orange color to match the logo
            .setTitle('Welcome To 1Sat Society')
            .setDescription('To ensure a smooth and secure experience, we need all members to verify their Yours wallets before gaining access. Please click verify wallet to get started.')
            .setURL('https://fantastic-space-couscous-w4q9gr5prrwfjwj-5000.app.github.dev/auth')
            .setTimestamp();

        const button = new ButtonBuilder()
            .setLabel('Verify Wallet')
            .setStyle(ButtonStyle.Link)
            .setURL('https://fantastic-space-couscous-w4q9gr5prrwfjwj-5000.app.github.dev/auth');

        const row = new ActionRowBuilder().addComponents(button);

        const pinnedMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // Optionally pin the message
        try {
            await pinnedMessage.pin();
        } catch (error) {
            console.error('Could not pin the message:', error);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

process.on("SIGINT", () => {
    client.destroy();
    process.exit();
});
