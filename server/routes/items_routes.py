from flask import Blueprint, request, jsonify
from ..services.items_service import *

item_blueprint = Blueprint('item_blueprint', __name__)

@item_blueprint.route('/items', methods=['GET'])
def get_items():
    items = get_all_items()
    return jsonify(items)

@item_blueprint.route('/item/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = get_item_by_id(item_id)
    return jsonify(item)

@item_blueprint.route('/item', methods=['POST'])
def add_item():
    data = request.json
    result = add_new_item(data['name'], data['category'], data['description'], data['quantity'], data['donorId'], data['location'])
    print("Item Result", result)
    return jsonify(result)

@item_blueprint.route('/item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.json
        result = update_item_details(item_id, data['name'], data['category'], data['description'], data['quantity'], data['donorId'], data['location'])
        return jsonify(result), 200
    except Exception as e:
        print({"Error": str(e)}) 
        return jsonify({'error': str(e)}), 400

@item_blueprint.route('/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    result = delete_item_by_id(item_id)
    return jsonify(result)
