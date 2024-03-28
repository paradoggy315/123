from flask import Blueprint, request, jsonify
from ..services.pledge_service import *

pledge_blueprint = Blueprint('pledge_blueprint', __name__)

@pledge_blueprint.route('/pledges', methods=['GET'])
def get_pledges():
    try:
        pledges = get_all_pledges()
        return jsonify(pledges), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch pledges: {str(e)}'}), 500

@pledge_blueprint.route('/pledge/<int:pledge_id>', methods=['GET'])
def get_pledge(pledge_id):
    try:
        pledge = get_pledge_by_id(pledge_id)
        if pledge:
            return jsonify(pledge), 200
        else:
            return jsonify({'message': 'Pledge not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to fetch pledge: {str(e)}'}), 500

@pledge_blueprint.route('/pledge', methods=['POST'])
def add_pledge():
    try:
        data = request.json
        result = add_new_pledge(data['UserID'], data['ItemID'], data['QuantityPledged'], data['Status'])
        return jsonify({'message': 'Pledge added successfully', 'pledgeID': result}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': f'Failed to add pledge: {str(e)}'}), 400

@pledge_blueprint.route('/pledge/<int:pledge_id>', methods=['PUT'])
def update_pledge(pledge_id):
    try:
        data = request.json
        print(data)
        result = update_pledge_details(pledge_id, data['UserID'], data['ItemID'], data['QuantityPledged'], data['Status'])
        return jsonify({'message': 'Pledge updated successfully', 'result': result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': f'Failed to update pledge: {str(e)}'}), 500

@pledge_blueprint.route('/pledge/<int:pledge_id>', methods=['DELETE'])
def delete_pledge(pledge_id):
    try:
        result = delete_pledge_by_id(pledge_id)
        return jsonify({'message': 'Pledge deleted successfully', 'result': result}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to delete pledge: {str(e)}'}), 400
    
@pledge_blueprint.route('/user/<int:user_id>/pledges', methods=['GET'])
def get_pledges_by_user(user_id):
    try:
        pledges = get_user_pledges(user_id)
        return jsonify(pledges), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user pledges: {str(e)}'}), 500    
