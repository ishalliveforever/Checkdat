import os
import discord
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import asyncio

load_dotenv()
app = Flask(__name__)

print("Loaded environment variables...")
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')

print(f"Client ID: {DISCORD_CLIENT_ID}")
print(f"Client Secret: {DISCORD_CLIENT_SECRET}")
print(f"Redirect URI: {DISCORD_REDIRECT_URI}")

intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)
print("Discord client initialized with intents.")

@app.route("/get_discord_username/<account>", methods=["GET"])
def get_discord_username(account):
    print(f"Received request to get Discord username for account ID: {account}")
    user_id = int(account)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    print("Starting new asyncio event loop...")
    username = loop.run_until_complete(fetch_user_name(user_id))
    loop.close()
    print("Closed asyncio loop.")
    return jsonify({"username": username})

async def fetch_user_name(user_id):
    try:
        print(f"Fetching user data for user ID: {user_id}")
        user = await client.fetch_user(user_id)
        print(f"Found user: {user.name}#{user.discriminator}")
        return f"{user.name}#{user.discriminator}"
    except discord.NotFound:
        print(f"User with ID {user_id} not found.")
        return f"Unknown User ({user_id})"
    except discord.HTTPException as e:
        print(f"Failed to fetch user {user_id} due to HTTPException: {e}")
        return f"Unknown User ({user_id})"
    except Exception as e:
        print(f"An unexpected error occurred while fetching user {user_id}: {e}")
        return f"Unknown User ({user_id})"

@app.route("/discord/oauth2/callback", methods=["GET"])
def oauth2_callback():
    code = request.args.get('code')
    state = request.args.get('state')
    print(f"Received OAuth2 callback with code: {code} and state: {state}")

    # Verify the state parameter for security (implement if using state)
    # Exchange code for an access token
    token_url = "https://discord.com/api/oauth2/token"
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI,
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    print("Requesting access token from Discord...")
    token_response = request.post(token_url, data=data, headers=headers)
    token_response_data = token_response.json()
    access_token = token_response_data['access_token']
    print(f"Access token received: {access_token}")

    # Fetch user information
    user_info_url = "https://discord.com/api/users/@me"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    print("Fetching user information...")
    user_info_response = request.get(user_info_url, headers=headers)
    user_info = user_info_response.json()
    print(f"User information received: {user_info}")

    return jsonify(user_info)

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(port=5000)
