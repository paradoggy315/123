from ..db import execute_procedure

def get_all_disaster_events():
    return execute_procedure('GetAllDisasterEvents')

def get_disaster_event_by_id(disaster_event_id):
    return execute_procedure('GetDisasterEventById', (disaster_event_id,))