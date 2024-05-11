from flask import Flask, request, redirect, session, jsonify, render_template
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'super_secret_key')

DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')

@app.route('/')
def home():
    return 'Home Page - Server is Running'

@app.route('/auth')
def auth():
    discord_oauth_url = f"https://discord.com/api/oauth2/authorize?client_id={DISCORD_CLIENT_ID}" \
                        f"&redirect_uri={DISCORD_REDIRECT_URI}&response_type=code&scope=identify"
    return redirect(discord_oauth_url)

@app.route('/oauth2/callback')
def oauth2_callback():
    code = request.args.get('code')
    if not code:
        return "Authorization request did not include a code.", 400
    token_data = exchange_code_for_token(code)
    access_token = token_data.get('access_token')
    if not access_token:
        return jsonify({'error': 'Failed to obtain access token'}), 500
    user_data = fetch_discord_user_data(access_token)
    session['username'] = user_data.get('username')
    session['access_token'] = access_token
    return redirect('/verify_wallet')

@app.route('/verify_wallet')
def verify_wallet():
    username = session.get('username', 'unknown user')
    return render_template('index.html', username=username)

def exchange_code_for_token(code):
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    token_response = requests.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
    if token_response.status_code == 200:
        return token_response.json()
    return {}

def fetch_discord_user_data(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://discord.com/api/users/@me', headers=headers)
    if response.status_code == 200:
        return response.json()
    return {}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
