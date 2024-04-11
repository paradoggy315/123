from flask import Blueprint, jsonify, request
from ..services.disaster_event_service import *


disaster_event_blueprint = Blueprint('disaster_event_blueprint', __name__)

@disaster_event_blueprint.route('/disaster_events')
def disaster_events():
    disaster_events = get_all_disaster_events()
    return jsonify(disaster_events)

@disaster_event_blueprint.route('/disaster_event/<int:disaster_event_id>')
def disaster_event_by_id(disaster_event_id):
    disaster_event = get_disaster_event_by_id(disaster_event_id)
    return jsonify(disaster_event)

@disaster_event_blueprint.route('/addDisasterEvent', methods=['POST'])
def create_disaster_event():
    try:
        data = request.json
        print(data)
        add_disaster_event(data['eventName'],data['location'],data['startDate'],data['endDate'],data['description'])
        return jsonify(message="Disaster added successfully"), 201
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500