from flask import Blueprint, jsonify
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