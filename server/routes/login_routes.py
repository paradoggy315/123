from flask import Blueprint, request, jsonify
from ..services.login_services import *
from itsdangerous import URLSafeTimedSerializer as Serializer
import bcrypt

login_blueprint = Blueprint('login_bp', __name__)
import os


@login_blueprint.route('/login', methods=['POST'])
def handle_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password').encode('utf-8')
        user = get_user_by_username(username)
        if not user:
            return jsonify({"error": "Username or password not found"}), 405
        
        print("User:", user)
        print("Password:", password)
        print("Stored Password:", user['PasswordHash'])
        
        
        if not isinstance(user['PasswordHash'], bytes):
            stored_password = user['PasswordHash'].encode('utf-8')
        else:
            stored_password = user['PasswordHash']

        
        
    
    
        if bcrypt.checkpw(password, stored_password):
            # Create a serializer with your secret key
            secret_key = os.getenv("TOKEN_SECRET")
            if not secret_key:
                raise EnvironmentError("TOKEN_SECRET is not set in the environment variables.")
            serializer = Serializer(secret_key)
            
            # Generate a token with a user-specific payload
            token = serializer.dumps({'user_id': user['UserID']})

            # Return the user ID, username, role, and token
            return jsonify({
                'user_id': user['UserID'],
                'username': user['Username'],
                'role': user['Role'],
                'token': token
            }), 200
        else:
            return jsonify({"error": "Username or password not found"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500