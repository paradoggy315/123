from flask import Blueprint, jsonify, request
from ..services.register_service import get_all_users, username_exists, email_exists, add_user
from ..utils.register_util import encrypt_password  # Ensure the correct import path

register_blueprint = Blueprint('register_bp', __name__)

@register_blueprint.route('/register', methods=['GET'])
def handle_get_all_users():
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@register_blueprint.route('/register', methods=['POST'])
def handle_add_user():
    try:
        user_data = request.json

        # Check if username already exists
        if username_exists(user_data['username']):
            return jsonify({"error": "Username already exists"}), 400
        
        # Check if email already exists
        if email_exists(user_data['email']):
            return jsonify({"error": "Email already registered"}), 400

        # Encrypt the password before storing it
        encrypted_password = encrypt_password(user_data['password'])
        
        add_user(user_data['username'], user_data['email'], encrypted_password, user_data['role'])
        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


