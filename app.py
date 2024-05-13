from flask import Flask, request, redirect, session, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'super_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    bsv_address = db.Column(db.String(120), unique=True, nullable=True)
    ord_address = db.Column(db.String(120), unique=True, nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'

def setup_database():
    with app.app_context():
        db.create_all()

@app.route('/')
def home():
    return 'Home Page - Server is Running'

@app.route('/show_users')
def show_users():
    users = User.query.all()  # Fetch all user records from the database
    user_data = '<br>'.join([f"Username: {user.username}, BSV Address: {user.bsv_address or 'Not set'}, ORD Address: {user.ord_address or 'Not set'}" for user in users])
    return user_data if user_data else "No users found"

@app.route('/auth')
def auth():
    discord_oauth_url = f"https://discord.com/api/oauth2/authorize?client_id={os.getenv('DISCORD_CLIENT_ID')}" \
                        f"&redirect_uri={os.getenv('DISCORD_REDIRECT_URI')}&response_type=code&scope=identify"
    return redirect(discord_oauth_url)

@app.route('/api/getUserBSVAddress', methods=['GET'])
def get_user_bsv_address():
    username = request.args.get('username')
    print(f"Looking up BSV address for username: {username}")  # Debug log
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify(bsvAddress=user.bsv_address if user.bsv_address else "not set")
    else:
        return jsonify(error="User not found"), 404

@app.route('/api/initiatePayment', methods=['POST'])
def initiate_payment():
    payment_data = request.json
    bsv_address = payment_data.get('address')
    satoshis = payment_data.get('satoshis')
    transaction_id = send_bsv(bsv_address, satoshis)  # Function to send BSV using Panda Wallet's API

    if transaction_id:
        return jsonify({"transactionId": transaction_id}), 200
    else:
        return jsonify({"error": "Failed to initiate payment"}), 500

def send_bsv(address, amount):
    # This function would interact with Panda Wallet's API to send BSV
    # You would use the provider API here to execute the transaction
    # Dummy implementation:
    return "dummy_transaction_id"

if __name__ == '__main__':
    app.run(debug=True)   

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
    username = user_data.get('username')

    # Ensure user is fetched or created without duplicating address entries
    user = User.query.filter_by(username=username).first()
    if user is None:
        user = User(username=username)  # Do not set addresses here
        db.session.add(user)

    db.session.commit()
    session['user_id'] = user.id  # Save user ID in session for later use
    return redirect('/verify_wallet')


@app.route('/save_wallet_addresses', methods=['POST'])
def save_wallet_addresses():
    data = request.json
    username = data['username']
    new_bsv_address = data['bsvAddress']
    new_ord_address = data['ordAddress']

    # Find the user by username or create a new one
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username, bsv_address=new_bsv_address, ord_address=new_ord_address)
        db.session.add(user)
    else:
        # Update addresses only if they are not set
        if user.bsv_address is None:
            user.bsv_address = new_bsv_address
        if user.ord_address is None:
            user.ord_address = new_ord_address

    db.session.commit()
    
    return jsonify({"message": "Addresses saved successfully"}), 200


@app.route('/verify_wallet')
def verify_wallet():
    user_id = session.get('user_id')
    if not user_id:
        return 'User not logged in', 400
    user = User.query.get(user_id)
    return render_template('index.html', username=user.username)

def exchange_code_for_token(code):
    data = {
        'client_id': os.getenv('DISCORD_CLIENT_ID'),
        'client_secret': os.getenv('DISCORD_CLIENT_SECRET'),
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': os.getenv('DISCORD_REDIRECT_URI')
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    token_response = requests.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
    return token_response.json() if token_response.status_code == 200 else {}

def fetch_discord_user_data(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://discord.com/api/users/@me', headers=headers)
    return response.json() if response.status_code == 200 else {}

if __name__ == '__main__':
    setup_database()  # Ensure database is setup at startup
    app.run(host='0.0.0.0', port=5000, debug=True)