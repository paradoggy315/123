from ..db import execute_procedure

def get_all_requests():
    return execute_procedure('GetAllRequests')

def add_request(event_id, user_id, item_id, quantity_needed, status, create_date):
    execute_procedure('AddRequest', (event_id, user_id, item_id, quantity_needed, status, create_date))

def update_request(request_id, event_id, user_id, item_id, quantity_needed, status):
    execute_procedure('UpdateRequest', (request_id, event_id, user_id, item_id, quantity_needed, status))

def delete_request(request_id):
    execute_procedure('DeleteRequest', (request_id,))

def get_request_by_id(request_id):
    return execute_procedure('GetRequestByID', (request_id,))

def get_requests_and_events_info():
    return execute_procedure('GetRequestsAndEventsInfo')


