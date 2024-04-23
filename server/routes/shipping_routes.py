from flask import Blueprint, request, jsonify
from ..services.shipping_service import add_shipping_details

shipping_blueprint = Blueprint('shipping_blueprint', __name__)

@shipping_blueprint.route('/shipping', methods=['POST'])
def create_shipping():
    try:
        data = request.json
        result = add_shipping_details(
            data.get('pledge_id'),
            data.get('response_id'),
            data['carrier'],
            data['tracking_number'],
            data['shipping_date']
        )
        return jsonify({'message': 'Shipping details added successfully', 'result': result}), 201
    except Exception as e:
        return jsonify({'error': f'Failed to add shipping details: {str(e)}'}), 500
