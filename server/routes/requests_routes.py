from flask import Blueprint, request, jsonify
from ..services.request_service import *

requests_blueprint = Blueprint('requests_bp', __name__)

@requests_blueprint.route('/requests', methods=['GET'])
def handle_get_all_requests():
    try:
        requests = get_all_requests()
        return jsonify(requests), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@requests_blueprint.route('/requests/<int:request_id>', methods=['GET'])
def handle_get_request_by_id(request_id):
    try:
        request_data = get_request_by_id(request_id)
        if request_data:
            return jsonify(request_data), 200
        else:
            return jsonify(error="Request not found"), 404
    except Exception as e:
        return jsonify(error=str(e)), 500

@requests_blueprint.route('/add-request', methods=['POST'])
def handle_add_request():
    try:
        data = request.json
        if 'item_id' not in data:
            print(data)
            print("Missing item_id")
            return jsonify(error="Missing item_id"), 400  # Bad Request for missing data
        add_request(data['event_id'], data['user_id'], data['item_id'], data['quantity_needed'], data['status'], data['create_date'])
        return jsonify(message="Request added successfully"), 201
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500

@requests_blueprint.route('/requests/<int:request_id>', methods=['PUT'])
def handle_update_request(request_id):
    try:
        data = request.json
        update_request(request_id, data['event_id'], data['user_id'], data['item_id'], data['quantity_needed'], data['status'])
        return jsonify(message="Request updated successfully"), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@requests_blueprint.route('/requests/<int:request_id>', methods=['DELETE'])
def handle_delete_request(request_id):
    try:
        delete_request(request_id)
        return jsonify(message="Request deleted successfully"), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@requests_blueprint.route('/requests/events_info', methods=['GET'])
def handle_get_requests_and_events_info():
    try:
        requests_events_info = get_requests_and_events_info()
        return jsonify(requests_events_info), 200
    except Exception as e:
        return jsonify(error=str(e)), 500    