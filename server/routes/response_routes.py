from flask import Blueprint, request, jsonify
from ..services.response_service import *

responses_blueprint = Blueprint('responses_bp', __name__)

@responses_blueprint.route('/responses', methods=['GET'])
def get_all_responses():
    try:
        responses = get_all_responses_service()
        return jsonify(responses), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@responses_blueprint.route('/responses/<int:response_id>', methods=['GET'])
def get_response_by_id(response_id):
    try:
        response_data = get_response_by_id_service(response_id)
        if response_data:
            return jsonify(response_data), 200
        else:
            return jsonify(error="Response not found"), 404
    except Exception as e:
        return jsonify(error=str(e)), 500

@responses_blueprint.route('/add-response', methods=['POST'])
def add_response():
    try:
        data = request.json
        response_id = add_response_service(
            data['user_id'],
            data['matched_request_id'],
            data['quantity_provided'],
            data['status']
        )
        return jsonify(response_id=response_id), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@responses_blueprint.route('/responses/<int:response_id>', methods=['PUT'])
def update_response(response_id):
    try:
        data = request.json
        update_response_service(
            response_id,
            data['user_id'],
            data['matched_request_id'],
            data['quantity_provided'],
            data['status']
        )
        return jsonify(message="Response updated successfully"), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@responses_blueprint.route('/responses/<int:response_id>', methods=['DELETE'])
def delete_response(response_id):
    try:
        delete_response_service(response_id)
        return jsonify(message="Response deleted successfully"), 200
    except Exception as e:
        return jsonify(error=str(e)), 500


@responses_blueprint.route('/responses/request/<int:request_id>', methods=['GET'])
def get_responses_by_request_id(request_id):
    try:
        responses = get_responses_by_request_id_service(request_id)
        return jsonify(responses), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
    
    
