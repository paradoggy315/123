from flask import Blueprint, request, jsonify
from ..services.pledge_service import *
from ..services.request_service import get_request_by_id, update_request
from ..services.response_service import add_response_service
from flask import has_request_context

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
        return jsonify({'message': 'Pledge added successfully', 'pledgeID': result}), 200
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
    
@pledge_blueprint.route('/pledges/match', methods=['POST'])
def match_pledge_to_request():
    try:
        data = request.json
        pledge_id = data.get('pledgeId')
        request_id = data.get('requestId')

        if not pledge_id or not request_id:
            return jsonify({'error': 'Missing pledgeId or requestId'}), 400

        # Retrieve the pledge and request, ensuring we handle them as single dictionary entries
        pledge_data = get_pledge_by_id(pledge_id)
        request_data = get_request_by_id(request_id)

        if not pledge_data or not isinstance(pledge_data, list) or not pledge_data[0]:
            return jsonify({'error': 'Pledge not found'}), 404
        if not request_data or not isinstance(request_data, list) or not request_data[0]:
            return jsonify({'error': 'Request not found'}), 404

        # Extract the first dictionary from the lists
        pledge = pledge_data[0]
        retrieved_request = request_data[0]

        # Check for all required keys before proceeding
        if 'QuantityPledged' not in pledge or 'QuantityNeeded' not in retrieved_request:
            return jsonify({'error': 'Essential data missing from pledge or request'}), 500

        amount_to_respond = min(pledge['QuantityPledged'], retrieved_request['QuantityNeeded'])
        remaining_pledge_quantity = pledge['QuantityPledged'] - amount_to_respond

        print("In here now")
        if remaining_pledge_quantity > 0:
            update_pledge_details(pledge_id, pledge['UserID'], pledge['ItemID'], remaining_pledge_quantity, pledge['Status'])
        else:
            update_pledge_details(pledge_id, pledge['UserID'], pledge['ItemID'], 0, 'Fulfilled')

        # Additional check for 'EventID'
        if 'EventID' not in retrieved_request:
            print("Request data does not contain 'EventID'")
            return jsonify({'error': "Request data does not contain 'EventID'"}), 500

        print ("Pledge: ", pledge)
        response_id = add_response_service(pledge['UserID'], request_id, amount_to_respond, 'Pending')
        print("Made it here")

        new_quantity_needed = retrieved_request['QuantityNeeded'] - amount_to_respond
        request_status = 'Open' if new_quantity_needed > 0 else 'Fulfilled'
        
        print("Request ID: ", request_id)
        print("Retrieved Request: ", retrieved_request)
        update_request(request_id, retrieved_request['EventID'], retrieved_request['UserID'], retrieved_request['ItemID'], new_quantity_needed, request_status)
        print("Made it here")

        return jsonify({'message': 'Pledge matched to request successfully', 'responseId': response_id}), 200

    except Exception as e:
        print("Error: ", e)
        return jsonify({'error': str(e)}), 500      
