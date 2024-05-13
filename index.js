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

async function initProvider() {
    console.log("Initializing Panda Wallet provider...");
    // Assume this is a placeholder; replace with actual Panda Wallet API initialization
    return {
        sendBsv: async (paymentParams) => {
            console.log("Attempting to send BSV:", paymentParams);
            // Placeholder for sending transaction; replace with actual API call
            return { txid: '123456789abcdef' };  // Simulated transaction ID
        }
    };
}

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    if (message.content.toLowerCase().startsWith('/pay')) {
        const args = message.content.slice('/pay'.length).trim().split(' ');
        if (args.length < 2) {
            message.reply("Usage: /pay [@username or BSVaddress] [amount in BSV]");
            return;
        }

        let [payee, amount] = args;
        let bsvAddress = payee;

        // Handle mention-based payment
        if (payee.startsWith('<@') && payee.endsWith('>')) {
            payee = payee.slice(2, -1); // Strip the mention syntax
            if (payee.startsWith('!')) {
                payee = payee.slice(1); // Handle nickname mentions
            }

            // Fetch user object from Discord
            const user = await client.users.fetch(payee);
            if (user) {
                try {
                    const userResponse = await axios.get(`${process.env.SERVER_URL}/api/getUserBSVAddress`, {
                        params: { username: user.username }
                    });
                    if (userResponse.data.bsvAddress) {
                        bsvAddress = userResponse.data.bsvAddress;
                    } else {
                        message.reply("User has not set up a BSV address.");
                        return;
                    }
                } catch (err) {
                    console.error("Error fetching BSV address:", err);
                    message.reply("Could not fetch BSV address for user.");
                    return;
                }
            }
        }

        const satoshis = parseFloat(amount) * 100000000;
        const wallet = await initProvider();
        if (!wallet) {
            message.reply("Failed to initialize Panda Wallet.");
            return;
        }

        try {
            const { txid } = await wallet.sendBsv([{ satoshis, address: bsvAddress }]);
            message.reply(`Payment of ${amount} BSV to ${bsvAddress} initiated. Transaction ID: ${txid}`);
        } catch (error) {
            console.error("Failed to initiate payment:", error);
            message.reply('Failed to initiate payment. Please try again.');
        }
    } else if (message.content.toLowerCase() === '!verify') {
        const authUrl = `${process.env.SERVER_URL}/auth`;
        const button = new ButtonBuilder()
            .setLabel('Click to Verify')
            .setStyle(ButtonStyle.Link)
            .setEmoji('🔗')
            .setURL(authUrl);

        const row = new ActionRowBuilder().addComponents(button);

        try {
            await message.reply({ content: 'Please verify your wallet for admittance', components: [row] });
            console.log(`Verification link sent to user ${message.author.tag}.`);
        } catch (error) {
            console.error("Failed to send verification link:", error);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

process.on("SIGINT", () => {
    client.destroy();
    process.exit();
});
