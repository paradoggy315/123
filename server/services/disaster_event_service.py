from ..db import execute_procedure

def get_all_disaster_events():
    return execute_procedure('GetAllDisasterEvents')

def get_disaster_event_by_id(disaster_event_id):
    return execute_procedure('GetDisasterEventById', (disaster_event_id,))

def add_disaster_event(event_name, location, start_date, end_date, description):
    execute_procedure('AddDisasterEvent', (event_name, location, start_date, end_date, description))

#Do I need to inclue the event_id in my add_disaster_event service paramaters