from ..db import execute_procedure

def get_all_responses_service():
    return execute_procedure('GetAllResponses')

def get_response_by_id_service(response_id):
    return execute_procedure('GetResponseByID', (response_id,))

def add_response_service(user_id, matched_request_id, quantity_provided, status):
    return execute_procedure(
        'CreateResponseAndUpdateRequest', 
        (user_id, matched_request_id, quantity_provided, status)
    )

def update_response_service(response_id, user_id, matched_request_id, quantity_provided, status):
    execute_procedure(
        'UpdateResponse', 
        (response_id, user_id, matched_request_id, quantity_provided, status)
    )

def delete_response_service(response_id):
    execute_procedure('DeleteResponse', (response_id,))
    
def get_responses_by_request_id_service(request_id):
    return execute_procedure('GetAllResponses', (request_id,))    