from flask import Blueprint, request, jsonify
from ..services.user_services import *

users_blueprint = Blueprint('users_bp', __name__)

@users_blueprint.route('/users', methods=['GET'])
def handle_get_all_users():
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@users_blueprint.route('/users/<int:user_id>', methods=['GET'])
def handle_get_user_by_id(user_id):
    try:
        user_data = get_user_by_id(user_id)
        if user_data:
            return jsonify(user_data), 200
        else:
            return jsonify(error="User not found"), 404
    except Exception as e:
        return jsonify(error=str(e)), 500
    
    
@users_blueprint.route('/users/update-address/<int:user_id>', methods=['POST'])
def handle_update_user_address(user_id):
    try:
        data = request.json
        update_user_address(user_id, data['address'], data['country'], data['state'], data['zip_code'], data['region'])
        return jsonify(message="User address updated successfully"), 200
    except Exception as e:
        print(str(e))
        return jsonify(error=str(e)), 500    