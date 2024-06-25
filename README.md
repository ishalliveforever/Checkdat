# CheckDat Bot Setup Guide

## Overview

CheckDat Bot is a Discord bot integrated with a Flask web server. It helps manage user verifications by interacting with the Panda Wallet and checking NFT collections. This guide provides step-by-step instructions to set up the bot and its accompanying web server. Additionally, it recommends using "The Bouncer" bot on the Discord side to enhance functionality.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Discord account and server
- MongoDB (for storing user data)
- Panda Wallet extension installed in your browser

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/checkdat-bot.git
cd checkdat-bot
```

### 2. Set Up the Python Environment

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 3. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Install Node.js Dependencies

Navigate to the `bot` directory and install the required Node.js packages:

```bash
cd bot
npm install
```

### 5. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```plaintext
# Discord Bot Configuration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_PUBLIC_KEY=your_discord_public_key
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_guild_id

# Discord Roles IDs
GRAND_TARDINIANS_ROLE_ID=your_grand_tardinians_role_id
ORDER_OF_THE_DELTA_ROLE_ID=your_order_of_the_delta_role_id
ZERO_FACE_ROLE_ID=your_zero_face_role_id
Pixel_Foxes=your_pixel_foxes_role_id
DISTORTION_ROLE_ID=your_distortion_role_id
ICARUS_CORP_ROLE_ID=your_icarus_corp_role_id
GM_PEPE_ROLE_ID=your_gm_pepe_role_id
DRAGON_ARMY_ROLE_ID=your_dragon_army_role_id
OG_FROGS_ROLE_ID=your_og_frogs_role_id
WTF_TOKYO_ROLE_ID=your_wtf_tokyo_role_id
TWETCH_SURVIVORS_ROLE_ID=your_twetch_survivors_role_id
BASED_FROGS_ROLE_ID=your_based_frogs_role_id

# Discord Webhook
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Server Configuration
SERVER_URL=your_server_url
DISCORD_REDIRECT_URI=your_discord_redirect_uri

# Flask Application Setup
FLASK_APP=app.py
FLASK_ENV=development
```

Replace the placeholders with your actual configuration values.

### 6. Set Up the Database

Ensure MongoDB is running and create a database for the application. You can use MongoDB Atlas or a local MongoDB instance.

### 7. Run the Flask Server

Navigate back to the root directory and start the Flask server:

```bash
flask run
```

### 8. Run the Discord Bot

In a new terminal, navigate to the `bot` directory and start the Discord bot:

```bash
node index.js
```

### 9. Configure "The Bouncer" Bot

To enhance the functionality of CheckDat Bot, configure "The Bouncer" bot on your Discord server. "The Bouncer" helps with managing roles and permissions more effectively. Follow the setup instructions provided by "The Bouncer" bot documentation.

## Usage

### Verifying Wallets

Users can verify their wallets by using the `!verify` command in any channel the bot has access to. The bot will send a link to the verification page where users can authenticate and link their wallet.

### Setting Links

Server administrators can use the `!setlink` command to set up verification links and pin them in the channel.

### Listing Items

Users can list items for sale using the `!list [item] [price]` command. The bot will handle the listing process and confirm the listing.

## Contributing

Feel free to submit issues and pull requests to contribute to the project. Please follow the contribution guidelines provided in the repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For any questions or support, please open an issue in the GitHub repository or contact the maintainers.

## Donate
BSV Address: 1AehJyGHnPXMZ2zg4wdBjaowdLTebysFus
BCH: qrxx9gycn3rrp6pd29p84ez2cceqc93gl5zdvttrjw
BTC Address: bc1q5dc49up9k8ne90xn4n6edxd908n8het9maxwhu
Doge: DJ1pkmDwdLS94ZSEJdVJoq2MHprDfjaUpZ
Sol: 9HmpAhDoicGehmGhbbN5kmhsd5uZGm2DEDt68cGiUseJ

