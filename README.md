# CheckDat

## Description
CheckDat is a Discord bot integrated with a Flask backend, designed to enhance user verification processes within Discord communities by connecting with Panda Wallet. This setup allows server admins to automate access control based on NFT ownership, linking users' blockchain identities to their Discord profiles.

## Features
- **Wallet Connection**: Enables users to connect their Panda Wallet to their Discord user profile.
- **NFT Verification**: Checks ownership of specific NFT collections to grant access to designated server channels.
- **Post-Verification Redirection**: Directs users to appropriate channels based on their NFT holdings after successful verification.
- **Flask Backend**: Manages all backend interactions securely, providing a robust and scalable solution for handling user data and verification logic.

## Dependencies
- Node.js
- Discord.js
- Flask

## Installation

To set up CheckDat, follow these steps:

```bash
git clone https://github.com/ishalliveforever/checkdat.git
cd checkdat
npm install
pip install -r requirements.txt
pip install flask
```

To make a list of python libraries run pip freeze 

```
pip freeze > requirements.txt
```
## Configuration

Create a `.env` file in your project root and include the following configurations:

```plaintext
# Discord Bot Configuration
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_PUBLIC_KEY=your_discord_public_key_here
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_discord_guild_id_here

# Discord Roles IDs
GRAND_TARDINIANS_ROLE_ID=your_grand_tardinians_role_id_here
ORDER_OF_THE_DELTA_ROLE_ID=your_order_of_the_delta_role_id_here
ZERO_FACE_ROLE_ID=your_zero_face_role_id_here
Pixel_Foxes=your_pixel_foxes_role_id_here

# Discord Webhook
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Server Configuration
SERVER_URL=your_server_url_here
DISCORD_REDIRECT_URI=your_discord_redirect_uri_here

# Flask Application Setup
FLASK_APP=app.py
FLASK_ENV=development
```

## Usage

To run the Flask server, execute:

```bash
flask run
```

To start the Discord bot, run:

```bash
node index.js
```

## Contributing
Contributions are welcome! Please fork the repository and submit pull requests with your suggested changes.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
OGKek9 - [Twitter](https://twitter.com/OGKek9)  
Project Link: [https://github.com/ishalliveforever/checkdat](https://github.com/ishalliveforever/checkdat)
